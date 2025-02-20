from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime

app = Flask(__name__)

# Load models and preprocessing tools
xgb_model = joblib.load("C:/Users/smsha/Desktop/model/test/xgb_model.pkl")
catboost_model = joblib.load("C:/Users/smsha/Desktop/model/test/catboost_model.pkl")
feature_names = joblib.load("C:/Users/smsha/Desktop/model/test/feature_names.pkl")
scaler = joblib.load("C:/Users/smsha/Desktop/model/test/scaler.pkl")

# Required columns
important_columns = [
    "ASSURED_AGE", "NOMINEE_RELATION", "OCCUPATION", "POLICY_SUMASSURED", "Premium",
    "PREMIUMPAYMENTMODE", "Annual_Income", "HOLDERMARITALSTATUS", "Policy_Term",
    "Policy_Payment_Term", "Product_Type", "CHANNEL", "POLICYRISKCOMMENCEMENTDATE"
]

def preprocess_input(df):
    # Handle missing values
    for col in important_columns:
        if col not in df.columns:
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
    return 'Server is running'

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    error, processed_data = preprocess_input(pd.DataFrame([data]))
    if error:
        return jsonify({"error": error}), 400
    
    # Get model predictions
    xgb_preds = xgb_model.predict_proba(processed_data)[:, 1]
    catboost_preds = catboost_model.predict_proba(processed_data)[:, 1]
    ensemble_preds = (xgb_preds + catboost_preds) / 2
    
    result = {
        "Predicted_Fraud": int(ensemble_preds >= 0.5),
        "Fraud_Probability": round(float(ensemble_preds), 4),
        "Risk_Value": round(float(ensemble_preds), 4),
    }
    return jsonify(result)

@app.route("/upload", methods=["POST"])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Read the file
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return jsonify({"error": "Invalid file format. Only CSV/XLSX files are supported."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    # Preprocess input data
    error, processed_data = preprocess_input(df)
    if error:
        return jsonify({"error": error}), 400
    
    # Get model predictions
    xgb_preds = xgb_model.predict_proba(processed_data)[:, 1]
    catboost_preds = catboost_model.predict_proba(processed_data)[:, 1]
    ensemble_preds = (xgb_preds + catboost_preds) / 2
    
    # Add predictions to DataFrame
    df["Fraud_Probability"] = ensemble_preds
    df["Predicted_Fraud"] = (ensemble_preds >= 0.5).astype(int)
    df["Risk_Value"] = df["Fraud_Probability"]
    
    # Define Risk Levels
    def assign_risk_level(prob):
        if prob >= 0.75:
            return "High"
        elif prob >= 0.5:
            return "Medium"
        else:
            return "Low"
    
    df["Risk_Level"] = df["Fraud_Probability"].apply(assign_risk_level)
    
    # Save the result file
    output_filename = f"fraud_predictions_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
    output_path = os.path.join("./", output_filename)
    df.to_csv(output_path, index=False)
    
    return send_file(output_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
