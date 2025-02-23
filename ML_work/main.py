import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
from flask import Flask, request, jsonify, send_file, Response
import pytesseract
from pdf2image import convert_from_path
import re
import json
import cv2
from tensorflow.keras.models import load_model
import io
from flask_cors import CORS

# Set Tesseract OCR path if required (For Windows Users)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r"C:\Program Files\poppler-24.08.0\Library\bin"
SIGNATURE_MODEL_PATH = "./signature.keras"

# Load Model
signature_model = load_model(SIGNATURE_MODEL_PATH)


def load_models():
    model = joblib.load("fraud_model.pkl")
    scaler = joblib.load("scaler.pkl")
    le_channel = joblib.load("label_encoder_channel.pkl")
    le_product = joblib.load("label_encoder_product.pkl")
    le_fraud = joblib.load("label_encoder_fraud.pkl")
    return model, scaler, le_channel, le_product, le_fraud

app = Flask(__name__)
CORS(app)
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

@app.route("/bulk-predict", methods=["POST"])
def bulk_predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if not file.filename:
            return jsonify({"error": "No file selected"}), 400

        # Read input data
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file)
        else:
            print(f"Unsupported file format: {file.filename}")
            return jsonify({"error": "Unsupported file format. Please upload a CSV or XLSX file."}), 400

        try:
            # Keep original data
            original_df = df.copy()

            # Convert dates with dayfirst=True for DD-MM-YYYY format
            df["claim_date"] = pd.to_datetime(df["claim_date"], dayfirst=True, errors='coerce')
            df["policy_start_date"] = pd.to_datetime(df["policy_start_date"], dayfirst=True, errors='coerce')

            # Check for invalid dates
            if df["claim_date"].isnull().any() or df["policy_start_date"].isnull().any():
                return jsonify({"error": "Some dates could not be parsed. Check the date format in your file."}), 400

            # Calculate claim duration
            df["claim_duration"] = (df["claim_date"] - df["policy_start_date"]).dt.days

            # Drop columns not needed for prediction
            df_pred = df.drop(columns=["claim_id", "policy_start_date", "claim_date"])

            # Transform categorical variables
            df_pred["channel"] = le_channel.transform(df_pred["channel"])
            df_pred["product_type"] = le_product.transform(df_pred["product_type"])

            # Scale features in the exact order used during training
            df_scaled = scaler.transform(df_pred)
            fraud_predictions = model.predict(df_scaled)

            # Add predictions to original dataframe
            original_df["fraud_category"] = le_fraud.inverse_transform(fraud_predictions)
            original_df["risk_level"] = ["High" if p > 3 else "Medium" if p > 1 else "Low"
                                         for p in fraud_predictions]
            original_df["status"] = "Pending"
            
            # Prepare response
            output = io.StringIO()
            original_df.to_csv(output, index=False)

            return Response(
                output.getvalue(),
                mimetype='text/csv',
                headers={"Content-Disposition": "attachment;filename=processed_claims.csv"}
            )

        except Exception as e:
            print(f"Processing error: {str(e)}")
            return jsonify({"error": f"Error processing data: {str(e)}"}), 400

    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({"error": str(e)}), 500



def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using OCR."""
    images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
    extracted_text = ""
    image_data = []

    for img in images:
        img_np = np.array(img)
        gray = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
        processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        text = pytesseract.image_to_string(processed_img, lang='eng')
        extracted_text += text + "\n"
        image_data.append((text, img_np))

    return extracted_text, image_data

def parse_claim_form(text):
    fields = {
        "claim_id": r"Claim ID:\s*(\S+)",
        "policy_start_date": r"Policy Start Date:\s*([\d-]+)",
        "claim_date": r"Claim Date:\s*([\d-]+)",
        "age": r"Age:\s*(\d+)",
        "premium_amount": r"Premium Amount \(INR\):\s*([\d,]+)",
        "sum_assured": r"Sum Assured \(INR\):\s*([\d,]+)",
        "income": r"Annual Income \(INR\):\s*([\d,]+)",
        "channel": r"Insurance Channel:\s*(\S+)",
        "product_type": r"Product Type:\s*(\S+)"
    }
    
    claim_data = {}
    for key, regex in fields.items():
        match = re.search(regex, text)
        claim_data[key] = match.group(1).strip() if match else None
    
    return claim_data

@app.route("/ocr-predict", methods=["POST"])
def ocr_predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    pdf_path = "uploaded_claim_form.pdf"
    file.save(pdf_path)
    
    extracted_text, image_data = extract_text_from_pdf(pdf_path)
    claim_data = parse_claim_form(extracted_text)
    
    if not claim_data:
        return jsonify({"error": "Could not extract data from PDF"}), 400
    
    input_data = np.array([[
        int(claim_data.get("age", 0)), 
        int(claim_data.get("premium_amount", 0)), 
        int(claim_data.get("sum_assured", 0)), 
        int(claim_data.get("income", 0)),
        (datetime.strptime(claim_data["claim_date"], "%Y-%m-%d") - datetime.strptime(claim_data["policy_start_date"], "%Y-%m-%d")).days,
        le_channel.transform([claim_data["channel"]])[0],
        le_product.transform([claim_data["product_type"]])[0]
    ]])
    
    input_data = scaler.transform(input_data)
    fraud_prediction = model.predict(input_data)[0]
    fraud_category = le_fraud.inverse_transform([fraud_prediction])[0]
    
    response = {
        **claim_data,
        "fraud_category": fraud_category,
        "confidence": "high" if fraud_prediction > 3 else "medium" if fraud_prediction > 1 else "low"
    }
    
    return jsonify(response)

def extract_signature(image_data):
    """Find and extract the signature region based on 'Signature' keyword in OCR text."""
    for text, img_np in image_data:
        match = re.search(r"Signature", text, re.IGNORECASE)
        if match:
            h, w = img_np.shape[:2]
            x, y = match.start(), int(h * 0.8)  # Adjust based on position of text
            signature_region = img_np[y:h, x:w]
            return signature_region

    return None

def predict_signature(image):
    """Predict if the extracted signature is real or forged."""
    try:
        # Convert to grayscale if not already
        if len(image.shape) == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
        # Resize to exact dimensions needed
        image_resized = cv2.resize(image, (128, 128))
        
        # Ensure correct shape and normalization
        image_resized = image_resized.astype('float32') / 255.0
        image_resized = image_resized.reshape(1, 128, 128, 1)
        
        prediction = signature_model.predict(image_resized, verbose=0)
        result = "forged" if prediction[0][0] >= 0.5 else "real"
        confidence = prediction[0][0] if prediction[0][0] >= 0.5 else 1 - prediction[0][0]

        return {"result": result, "confidence": round(confidence * 100, 2)}
    
    except Exception as e:
        print(f"Error in predict_signature: {str(e)}")  # Add debugging
        return {"error": str(e)}

@app.route("/signature_check", methods=["POST"])
def signature_check():
    """API Endpoint to check the authenticity of a signature in a PDF."""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    pdf_path = "uploaded_claim_form.pdf"
    file.save(pdf_path)

    extracted_text, image_data = extract_text_from_pdf(pdf_path)
    signature_img = extract_signature(image_data)

    if signature_img is not None:
        signature_prediction = predict_signature(signature_img)
    else:
        signature_prediction = {"error": "Signature not found"}

    return jsonify(signature_prediction)

if __name__ == "__main__":
    app.run(debug=True)
