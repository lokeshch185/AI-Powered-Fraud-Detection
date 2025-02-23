from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)

# Load models and preprocessing tools
xgb_model = joblib.load("./xgb_model.pkl")
catboost_model = joblib.load("./catboost_model.pkl")
feature_names = joblib.load("./feature_names.pkl")
scaler = joblib.load("./scaler.pkl")

# Required columns
important_columns = [
    "ASSURED_AGE", "NOMINEE_RELATION", "OCCUPATION", "POLICY_SUMASSURED", "Premium",
    "PREMIUMPAYMENTMODE", "Annual_Income", "HOLDERMARITALSTATUS", "Policy_Term",
    "Policy_Payment_Term", "Product_Type", "CHANNEL", "POLICYRISKCOMMENCEMENTDATE"
]

def preprocess_input(data):
    # Convert to DataFrame
    df = pd.DataFrame([data])
    
    # Handle missing values
    for col in important_columns:
        if col not in df.columns or pd.isnull(df[col]).all():
            return f"Missing required field: {col}", None
    df.fillna(0, inplace=True)
    
    # Convert date columns
    df["POLICYRISKCOMMENCEMENTDATE"] = pd.to_datetime(df["POLICYRISKCOMMENCEMENTDATE"], errors='coerce')
    df["POLICY_AGE"] = (pd.to_datetime("today") - df["POLICYRISKCOMMENCEMENTDATE"]).dt.days
    
    # Feature engineering
    df["PREMIUM_SUM_RATIO"] = df["Premium"] / df["POLICY_SUMASSURED"].replace(0, np.nan)
    df["PREMIUM_SUM_RATIO"].fillna(0, inplace=True)
    df.drop(columns=["POLICYRISKCOMMENCEMENTDATE"], inplace=True, errors='ignore')
    
    # Encode categorical features
    df = pd.get_dummies(df, drop_first=True)
    
    # Ensure all features match training data
    missing_cols = set(feature_names) - set(df.columns)
    for col in missing_cols:
        df[col] = 0
    df = df[feature_names]
    
    # Scale input
    df_scaled = scaler.transform(df)
    return None, df_scaled

@app.route('/')
def checking():
    return 'Server 1 is running'

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    error, processed_data = preprocess_input(data)
    if error:
        return jsonify({"error": error}), 400
    
    # Get model predictions
    xgb_preds = xgb_model.predict_proba(processed_data)[:, 1]
    catboost_preds = catboost_model.predict_proba(processed_data)[:, 1]
    ensemble_preds = (xgb_preds + catboost_preds) / 2
    
    result = {
        "Predicted_Fraud": int(ensemble_preds >= 0.5),
        "Fraud_Probability": round(float(ensemble_preds), 4),
        "Risk_Value": round(float(ensemble_preds), 4)
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

