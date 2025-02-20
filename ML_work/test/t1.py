import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from xgboost import XGBClassifier
from catboost import CatBoostClassifier
from imblearn.over_sampling import SMOTE

# Load dataset
file_path = 'C:/Users/smsha/Desktop/model/Fraud data FY 2023-24 for B&CC.xlsx'
df = pd.read_excel(file_path)

# Handle missing values
df.fillna(df.median(numeric_only=True), inplace=True)
df.fillna(df.mode().iloc[0], inplace=True)

# Convert date columns
date_cols = ['POLICYRISKCOMMENCEMENTDATE', 'Date of Death', 'INTIMATIONDATE']
for col in date_cols:
    df[col] = pd.to_datetime(df[col], errors='coerce')

# Feature Engineering
df['DAYS_TO_DEATH'] = (df['Date of Death'] - df['POLICYRISKCOMMENCEMENTDATE']).dt.days
df['EARLY_DEATH_CLAIM'] = (df['DAYS_TO_DEATH'] <= 180).astype(int)
df['PREMIUM_SUM_RATIO'] = df['Premium'] / df['POLICY SUMASSURED'].replace(0, np.nan)
df['PREMIUM_SUM_RATIO'].fillna(0, inplace=True)
df['POLICY_AGE'] = (pd.to_datetime('today') - df['POLICYRISKCOMMENCEMENTDATE']).dt.days

# Drop unnecessary columns
df.drop(columns=date_cols + ['DAYS_TO_DEATH', 'Dummy Policy No'], inplace=True, errors='ignore')

# Encode categorical features
df = pd.get_dummies(df, drop_first=True)

# Identify fraud target column
fraud_columns = [col for col in df.columns if col.startswith('Fraud Category')]
X = df.drop(columns=fraud_columns, errors='ignore')
y = df[fraud_columns[0]]

# Fix NaN and infinite values
X.replace([np.inf, -np.inf], np.nan, inplace=True)
X.fillna(X.median(numeric_only=True), inplace=True)

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Handle imbalanced data using SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Train best models
xgb_model = XGBClassifier(eval_metric='mlogloss')
catboost_model = CatBoostClassifier(verbose=0)

xgb_model.fit(X_train, y_train)
catboost_model.fit(X_train, y_train)

# Ensemble predictions
xgb_preds = xgb_model.predict_proba(X_test)[:, 1]
catboost_preds = catboost_model.predict_proba(X_test)[:, 1]
ensemble_preds = (xgb_preds + catboost_preds) / 2

# Convert probabilities to binary classification
threshold = 0.5
y_pred = (ensemble_preds >= threshold).astype(int)

# Assign risk value
risk_value = np.round(ensemble_preds, 4)

# Evaluation
def evaluate_model(y_true, y_pred, model_name):
    print(f"\n{model_name} Performance:")
    print("Accuracy:", accuracy_score(y_true, y_pred))
    print("AUC-ROC:", roc_auc_score(y_true, y_pred))
    print("Classification Report:\n", classification_report(y_true, y_pred))

evaluate_model(y_test, y_pred, "Ensemble Model (XGBoost + CatBoost)")

# Create output DataFrame
output_df = pd.DataFrame({
    'Predicted_Fraud': y_pred,
    'Fraud_Probability': ensemble_preds,
    'Risk_Value': risk_value
})

# Save output to CSV
output_df.to_csv("C:/Users/smsha/Desktop/model/test/fraud_predictions.csv", index=False)
print("Fraud predictions saved to fraud_predictions.csv")

import joblib

# Save models
joblib.dump(xgb_model, "C:/Users/smsha/Desktop/model/test/xgb_model.pkl")
joblib.dump(catboost_model, "C:/Users/smsha/Desktop/model/test/catboost_model.pkl")

print("Models saved successfully!")

# Save feature names used in training
joblib.dump(list(X.columns), "C:/Users/smsha/Desktop/model/test/feature_names.pkl")

# Save scaler
joblib.dump(scaler, "C:/Users/smsha/Desktop/model/test/scaler.pkl")
