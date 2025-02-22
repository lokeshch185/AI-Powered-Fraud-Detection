import pytesseract
from pdf2image import convert_from_path
import re
import json
import cv2
import numpy as np

# Set Tesseract OCR path if required (For Windows Users)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r"C:\Program Files\poppler-24.08.0\Library\bin"
def extract_text_from_pdf(pdf_path):
    """Convert PDF to Image and Extract Text Using OCR"""
    images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
   
    extracted_text = ""

    for img in images:
        img = np.array(img)  # Convert PIL image to NumPy array
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
        processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        extracted_text += pytesseract.image_to_string(processed_img, lang='eng') + "\n"

    return extracted_text

def parse_claim_form(text):
    """Parse Extracted Text into JSON"""
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

    return json.dumps(claim_data, indent=4)

# Usage Example
pdf_path = "C:/Users/smsha/Desktop/fraud/insurance_claim_form.pdf"  # Path to filled form
extracted_text = extract_text_from_pdf(pdf_path)
parsed_json = parse_claim_form(extracted_text)

print("📜 Extracted JSON Data:\n", parsed_json)

# Save JSON Output
with open("insurance_claim.json", "w") as json_file:
    json_file.write(parsed_json)

print("✅ JSON saved as insurance_claim.json")
