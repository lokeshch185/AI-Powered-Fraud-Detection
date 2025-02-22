from fpdf import FPDF

class ClaimFormPDF(FPDF):
    def header(self):
        # Add the SBI logo
        self.image("C:/Users/smsha/Desktop/fraud/test/logo.png", 10, 8, 33)  # Adjust path and size
        self.set_font("Arial", "B", 16)
        self.cell(0, 10, "State Bank of India - Insurance Claim Form", ln=True, align="C")
        self.ln(10)  # Extra space after title

    def add_section(self, title):
        self.ln(3)  # Space before the section
        self.set_fill_color(0, 102, 204)  
        self.set_text_color(255, 255, 255)  
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, f" {title}", ln=True, fill=True, align="L")
        self.ln(5)  # Space after section title
        self.set_text_color(0, 0, 0)  

    def add_field(self, label, value, width=65):
        self.set_font("Arial", "B", 12)
        self.cell(width, 8, label, border=1)
        self.set_font("Arial", "", 12)
        self.cell(120, 8, value, border=1, ln=True)  

    def generate_form(self, claim_data):
        self.add_page()
        
        # Section: Policy & Claim Details
        self.add_section("A. Policy & Claim Details")
        self.add_field("Claim ID:", claim_data.get("claim_id", ""))
        self.add_field("Policy Start Date:", claim_data.get("policy_start_date", ""))
        self.add_field("Claim Date:", claim_data.get("claim_date", ""))

        # Section: Insured Person Details
        self.add_section("B. Insured Person Details")
        self.add_field("Full Name:", claim_data.get("full_name", ""))
        self.add_field("Age:", str(claim_data.get("age", "")))
        self.add_field("Gender:", claim_data.get("gender", ""))
        self.add_field("Premium Amount (INR):", str(claim_data.get("premium_amount", "")))
        self.add_field("Sum Assured (INR):", str(claim_data.get("sum_assured", "")))
        self.add_field("Annual Income (INR):", str(claim_data.get("income", "")))
        
        # Section: Insurance Details
        self.add_section("C. Insurance & Channel Details")
        self.add_field("Insurance Channel:", claim_data.get("channel", ""))
        self.add_field("Policy Number:", claim_data.get("policy_number", ""))
        self.add_field("Product Type:", claim_data.get("product_type", ""))
        self.add_field("Claim Reason:", claim_data.get("claim_reason", ""))
        
        # Section: Contact Information
        self.add_section("D. Contact Information")
        self.add_field("Email Address:", claim_data.get("email", ""))
        self.add_field("Phone Number:", claim_data.get("phone", ""))
        self.add_field("Address:", claim_data.get("address", ""))

        # Space before signature section
        self.ln(10)

        # Section: Declaration & Signature
        
        self.multi_cell(0, 8, "I hereby declare that the information provided is accurate to the best of my knowledge.")
        self.ln(10)
        
        # Add Signature Image
        self.image("C:/Users/smsha/Desktop/fraud/test/agh1fraud_1.jpg", x=30, y=self.get_y(), w=30)  # Adjust path and size
        self.cell(60, 12, "Signature:", border=1)
        self.cell(60, 12, "Date:", border=1, ln=True)

        # Save the PDF
        pdf_path = "Insurance_Claim_Form.pdf"
        self.output(pdf_path)
        return pdf_path

# Claim data JSON
claim_data = {
    "claim_id": "C12345",
    "full_name": "John Doe",
    "age": 45,
    "gender": "Male",
    "premium_amount": 20000,
    "sum_assured": 500000,
    "income": 750000,
    "policy_start_date": "2023-01-15",
    "claim_date": "2024-02-20",
    "channel": "Bancassurance",
    "product_type": "Pension",
    "policy_number": "POL123456789",
    "claim_reason": "Medical Emergency",
    "email": "johndoe@example.com",
    "phone": "9876543210",
    "address": "123 Street, City, Country"
}

# Generate the claim form
pdf = ClaimFormPDF()
pdf_path = pdf.generate_form(claim_data)
pdf_path
