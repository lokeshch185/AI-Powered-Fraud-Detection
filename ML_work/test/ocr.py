import pytesseract
from pdf2image import convert_from_path
import json

def extract_text_from_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    extracted_text = ""
    for img in images:
        extracted_text += pytesseract.image_to_string(img, lang='eng') + "\n"
    return extracted_text

def parse_claim_form(text):
    fields = [
        "Claim ID", "Policy Start Date", "Claim Date", "Age", "Premium Amount",
        "Sum Assured", "Annual Income", "Channel", "Fraud Category"
    ]
    
    data = {}
    lines = text.split("\n")
    
    for field in fields:
        for line in lines:
            if field in line:
                value = line.split(field + ":")[-1].strip()
                data[field.replace(" ", "_").lower()] = value
                break
    
    return json.dumps(data, indent=4)

# Usage Example
pdf_path = "Insurance_Claim_Form.pdf"  # Replace with the path to the filled form
extracted_text = extract_text_from_pdf(pdf_path)
parsed_data = parse_claim_form(extracted_text)

print(parsed_data)
