from fpdf import FPDF

class ClaimFormPDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 16)
        self.cell(0, 10, "Insurance Claim Form", ln=True, align="C")
        self.ln(10)

    def add_section(self, title):
        self.set_fill_color(0, 102, 204)  
        self.set_text_color(255, 255, 255)  
        self.set_font("Arial", "B", 12)
        self.cell(0, 8, title, ln=True, fill=True, align="L")
        self.ln(5)
        self.set_text_color(0, 0, 0)  

    def add_field(self, label, width=50):
        self.set_font("Arial", "", 12)
        self.cell(width, 8, label, border=1)
        self.cell(100, 8, "", border=1, ln=True)  

    def generate_form(self):
        self.add_page()
        
        # Section: Policy & Claim Details
        self.add_section("A. Policy & Claim Details")
        self.add_field("Claim ID:")
        self.add_field("Policy Start Date:")
        self.add_field("Claim Date:")

        # Section: Insured Person Details
        self.add_section("B. Insured Person Details")
        self.add_field("Age:")
        self.add_field("Premium Amount:")
        self.add_field("Sum Assured:")
        self.add_field("Annual Income:")

        # Section: Insurance Details
        self.add_section("C. Insurance & Channel Details")
        self.add_field("Channel:")
        self.add_field("Fraud Category:")

        # Save the PDF
        pdf_path = "Insurance_Claim_Form.pdf"
        self.output(pdf_path)
        return pdf_path

# Generate the claim form
pdf = ClaimFormPDF()
pdf_path = pdf.generate_form()
pdf_path
