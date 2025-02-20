import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from datetime import datetime

app = Flask(__name__)

# Load trained models and scaler
xgb_model = joblib.load("C:/Users/smsha/Desktop/model/test/xgb_model.pkl")
catboost_model = joblib.load("C:/Users/smsha/Desktop/model/test/catboost_model.pkl")
scaler = joblib.load("C:/Users/smsha/Desktop/model/test/scaler.pkl")  # Save and load scaler
feature_names = joblib.load("C:/Users/smsha/Desktop/model/test/feature_names.pkl")  # Save feature names

# Function to preprocess input data
def preprocess_data(df):
    """Preprocess input data to match training data structure"""
    # Handle missing values
    df.fillna(df.median(numeric_only=True), inplace=True)
    df.fillna(df.mode().iloc[0], inplace=True)

    # Convert date columns
    date_cols = ['POLICYRISKCOMMENCEMENTDATE', 'Date of Death', 'INTIMATIONDATE']
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    # Feature engineering
    df['DAYS_TO_DEATH'] = (df['Date of Death'] - df['POLICYRISKCOMMENCEMENTDATE']).dt.days
    df['EARLY_DEATH_CLAIM'] = (df['DAYS_TO_DEATH'] <= 180).astype(int)
    df['PREMIUM_SUM_RATIO'] = df['Premium'] / df['POLICY SUMASSURED'].replace(0, np.nan)
    df['PREMIUM_SUM_RATIO'].fillna(0, inplace=True)
    df['POLICY_AGE'] = (datetime.today() - df['POLICYRISKCOMMENCEMENTDATE']).dt.days

    # Drop unnecessary columns
    df.drop(columns=date_cols + ['DAYS_TO_DEATH'], inplace=True, errors='ignore')

    # Encode categorical features using training features
    df = pd.get_dummies(df, drop_first=True)

    # Ensure test data has same columns as training
    missing_cols = [col for col in feature_names if col not in df.columns]
    for col in missing_cols:
        df[col] = 0  # Add missing columns with zero values

    # Align column order with training data
    df = df[feature_names]

    # Fix NaN and infinite values
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(df.median(numeric_only=True), inplace=True)

    # Scale features using the same scaler from training
    scaled_data = scaler.transform(df)
    return scaled_data

# Function to make predictions
def make_prediction(data):
    xgb_preds = xgb_model.predict_proba(data)[:, 1]
    catboost_preds = catboost_model.predict_proba(data)[:, 1]
    ensemble_preds = (xgb_preds + catboost_preds) / 2
    return ensemble_preds

@app.route('/')
def checking():
    return 'Server is running'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' in request.files:  # If file is uploaded
            file = request.files['file']
            file_ext = file.filename.split('.')[-1]

            if file_ext == 'csv':
                df = pd.read_csv(file)
            elif file_ext in ['xls', 'xlsx']:
                df = pd.read_excel(file)
            else:
                return jsonify({'error': 'Invalid file format. Only CSV and Excel files are supported.'})

            data = preprocess_data(df)
            predictions = make_prediction(data)

            df['Fraud_Probability'] = predictions
            df['Predicted_Fraud'] = (df['Fraud_Probability'] >= 0.5).astype(int)
            output_file = "predictions.csv"
            df.to_csv(output_file, index=False)

            return jsonify({'message': 'Predictions saved to predictions.csv', 'download_link': output_file})
        else:  # If JSON input for single-row prediction
            json_data = request.get_json()
            df = pd.DataFrame([json_data])
            data = preprocess_data(df)
            predictions = make_prediction(data)
            fraud_prob = float(predictions[0])
            is_fraud = int(fraud_prob >= 0.5)
            return jsonify({'Predicted_Fraud': is_fraud, 'Fraud_Probability': fraud_prob})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
