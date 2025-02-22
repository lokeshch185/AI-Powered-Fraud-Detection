import cv2
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from tensorflow.keras.models import load_model

# Set paths
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r"C:\Program Files\poppler-24.08.0\Library\bin"
SIGNATURE_MODEL_PATH = "C:/Users/smsha/Desktop/fraud/signature.keras"

# Load the trained signature verification model
signature_model = load_model(SIGNATURE_MODEL_PATH)

def extract_signature_from_pdf(pdf_path):
    """Extract signature image from the claim form PDF"""
    images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
    
    for img in images:
        img_np = np.array(img)
        gray = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
        
        # Assuming signature is at the bottom-right, adjust as needed
        height, width = gray.shape
        signature_region = gray[int(height * 0.8):height, int(width * 0.5):width]
        
        return signature_region

def predict_signature(image):
    """Predict if the extracted signature is forged or real"""
    try:
        # Resize and normalize
        image_resized = cv2.resize(image, (128, 128))
        image_resized = np.array(image_resized).reshape(1, 128, 128, 1) / 255.0
        
        # Predict
        prediction = signature_model.predict(image_resized, verbose=0)
        
        # Classification result
        result = "forged" if prediction[0][0] >= 0.5 else "real"
        confidence = prediction[0][0] if prediction[0][0] >= 0.5 else 1 - prediction[0][0]
        
        return {"result": result, "confidence": round(confidence * 100, 2)}
    
    except Exception as e:
        return {"error": str(e)}

# Example Usage
pdf_path = "C:/Users/smsha/Desktop/fraud/insurance_claim_form1.pdf"
signature_img = extract_signature_from_pdf(pdf_path)

if signature_img is not None:
    prediction = predict_signature(signature_img)
    print("🔍 Signature Prediction:", prediction)
else:
    print("❌ Could not extract signature from PDF.")
