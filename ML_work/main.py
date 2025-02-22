import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
from flask import Flask, request, jsonify, send_file


def load_models():
    model = joblib.load("fraud_model.pkl")
    scaler = joblib.load("scaler.pkl")
    le_channel = joblib.load("label_encoder_channel.pkl")
    le_product = joblib.load("label_encoder_product.pkl")
    le_fraud = joblib.load("label_encoder_fraud.pkl")
    return model, scaler, le_channel, le_product, le_fraud

app = Flask(__name__)
model, scaler, le_channel, le_product, le_fraud = load_models()

@app.route("/", methods=["GET"])
def working():
    return "Server is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    input_data = np.array([[
        data["age"], data["premium_amount"], data["sum_assured"], data["income"],
        (datetime.strptime(data["claim_date"], "%Y-%m-%d") - datetime.strptime(data["policy_start_date"], "%Y-%m-%d")).days,
        le_channel.transform([data["channel"]])[0],
        le_product.transform([data["product_type"]])[0]
    ]])
    
    input_data = scaler.transform(input_data)
    fraud_prediction = model.predict(input_data)[0]
    fraud_category = le_fraud.inverse_transform([fraud_prediction])[0]
    
    response = {
        "claim_id": data["claim_id"],
        "fraud_category": fraud_category,
        "confidence": "high" if fraud_prediction > 3 else "medium" if fraud_prediction > 1 else "low"
    }
    
    return jsonify(response)

@app.route("/bulk_predict", methods=["POST"])
def bulk_predict():
    file = request.files["file"]
    
    # Read input data
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file)
    elif file.filename.endswith(".xlsx"):
        df = pd.read_excel(file)
    else:
        return jsonify({"error": "Unsupported file format. Please upload a CSV or XLSX file."}), 400

    # Process Data
    df["claim_duration"] = (pd.to_datetime(df["claim_date"]) - pd.to_datetime(df["policy_start_date"])).dt.days
    df.drop(columns=["claim_id", "policy_start_date", "claim_date"], inplace=True)
    
    df["channel"] = le_channel.transform(df["channel"])
    df["product_type"] = le_product.transform(df["product_type"])
    
    df_scaled = scaler.transform(df)
    fraud_predictions = model.predict(df_scaled)
    
    df["fraud_category"] = le_fraud.inverse_transform(fraud_predictions)
    
    # Save result to a new CSV
    result_file = "fraud_predictions.csv"
    df.to_csv(result_file, index=False)

    return send_file(result_file, as_attachment=True, download_name="fraud_predictions.csv")

if __name__ == "__main__":
    app.run(debug=True)
