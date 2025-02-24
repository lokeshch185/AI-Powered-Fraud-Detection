# AI-Powered SBI Insurance Claims Management System

A modern AI-powered web application for managing insurance claims, detecting fraud, and providing customer support with efficiency and accuracy.

## Overview

Our system leverages AI-driven automation to streamline claims processing, enhance fraud detection, and provide real-time risk assessment. It significantly reduces processing time by 50% and operational costs by 20-30%, ensuring a secure and efficient insurance claim experience.

## Key Features

### User Features
- **Dashboard**: View claim statistics and important notifications.
- **File Claims**: Step-by-step claim submission with document upload.
- **Claims History**: Track and manage submitted claims.
- **Support Center**:
  - AI Chatbot assistance.
  - FAQ section.
  - Support ticket system.
  - Direct contact options.

### AI-Powered Fraud Detection
- **Risk Analysis & Anomaly Detection (96% Accuracy):**
  - **Temporal Analysis:** Flags suspicious early claims (within 180 days).
  - **Financial Patterns:** Assesses premium-to-sum assured ratios and income validation.
  - **Demographics:** Identifies high-risk age groups (20-35) and fraud clusters.
  - **Channel Assessment:** Detects fraudulent variations across distribution channels.
- **AI-Powered Document Analysis:**
  - OCR-based automated data extraction.
  - Signature authentication using CNN with 94% accuracy.
  - Fraud detection via K-Means clustering, PCA, and Random Forest.

### Admin Features
- **Dashboard**: View claims statistics and important notifications.
- **Claims Management**: Process and review claims with AI-driven risk assessment.
- **Document Verification**: Detects fraud and forgery.
- **Analytics Dashboard**: Visualizes fraud trends and risk insights.
- **User Management**: Manage accounts and permissions.

## Unique Selling Points (USP)
- **Custom-built fraud detection models** trained specifically for insurance claims.
- **Privacy-preserving analysis** for secure data handling.
- **Adaptive Learning System** that evolves with new fraud patterns.
- **Cloud-based deployment options** for scalability.
- **Integrated Stakeholder Platform** for insurers, investigators, and regulators.
- **Regulatory compliance automation** ensuring fair decision-making.

## Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Framer Motion (animations)
- React Icons
- Recharts (data visualization)

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Flask (AI Services)
- TensorFlow, Keras (Deep Learning)
- OpenCV (Image Processing)
- Scikit-learn, XGBoost (ML Algorithms)
- NLTK, spaCy (NLP)
- Pandas, NumPy (Data Processing)

## Installation Guide

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Python (v3.8 or higher)
- Virtualenv (for Python dependencies)

### Step 1: Clone the Repository
```sh
  git clone https://github.com/lokeshch185/AI-Powered-Fraud-Detection.git
  cd sbi
```

### Step 2: Setup Frontend
```sh
cd frontend
npm install  # or yarn install
npm run dev  # or yarn dev
```
Access the frontend at `http://localhost:5173`

### Step 3: Setup Backend
```sh
cd ../backend
npm install  # or yarn install
```
Create a `.env` file in `backend`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key
```
Start the backend server:
```sh
npm run dev  # or yarn dev
```
Backend API available at `http://localhost:5000`

### Step 4: Setup AI Services (Flask)
```sh
cd ../ML-work
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
Run the AI service:
```sh
python main.py
```
AI service available at `http://127.0.0.1:5001`

### Step 5: Run Anomaly Detection
```sh
python anomaly.py
```
Detection service runs at `http://127.0.0.1:5002`

## Troubleshooting
- Ensure MongoDB is running before starting the backend.
- If there are dependency issues, reinstall using `npm install` or `pip install -r requirements.txt`.
- Check if required ports are free before running services.

## Conclusion
This AI-powered claims management system modernizes insurance processing by integrating fraud detection, automated document verification, and AI-driven risk assessment. With an intelligent, scalable, and user-friendly design, it significantly improves efficiency, security, and user experience in insurance claims handling.

