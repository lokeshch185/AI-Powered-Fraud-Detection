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

    def add_field(self, label, width=65):
        self.set_font("Arial", "B", 12)
        self.cell(width, 8, label, border=1)
        self.set_font("Arial", "", 12)
        self.cell(120, 8, "", border=1, ln=True)  

    def generate_form(self):
        self.add_page()
        
        # Section: Policy & Claim Details
        self.add_section("A. Policy & Claim Details")
        self.add_field("Claim ID:")
        self.add_field("Policy Start Date:")
        self.add_field("Claim Date:")

        # Section: Insured Person Details
        self.add_section("B. Insured Person Details")
        self.add_field("Full Name:")
        self.add_field("Age:")
        self.add_field("Premium Amount (INR):")
        self.add_field("Sum Assured (INR):")
        self.add_field("Annual Income (INR):")

        # Section: Insurance Details
        self.add_section("C. Insurance & Channel Details")
        self.add_field("Insurance Channel:")
        self.add_field("Fraud Category:")
        self.add_field("Policy Number:")

        # Section: Contact Information
        self.add_section("D. Contact Information")
        self.add_field("Email Address:")
        self.add_field("Phone Number:")

        # Space before signature section
        self.ln(10)

        # Section: Declaration & Signature
        self.add_section("E. Declaration & Signature")
        self.multi_cell(0, 8, "I hereby declare that the information provided is accurate to the best of my knowledge.")
        self.ln(10)
        self.cell(60, 8, "Signature:", border=1)
        self.cell(60, 8, "Date:", border=1, ln=True)

        # Save the PDF
        pdf_path = "Insurance_Claim_Form.pdf"
        self.output(pdf_path)
        return pdf_path

# Generate the claim form
pdf = ClaimFormPDF()
pdf_path = pdf.generate_form()
pdf_path
