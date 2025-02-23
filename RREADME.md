# AI-powered SBI Insurance Claims Management System

A modern AI-powered web application for managing insurance claims and providing customer support.

## Features

### User Features
- **Dashboard**: View claim statistics and important notifications
- **File Claims**: Step-by-step claim submission process with document upload
- **Claims History**: Track and manage submitted claims
- **Support Center**: 
  - AI Chatbot assistance
  - FAQ section
  - Support ticket system
  - Direct contact options

### Admin Features
- **Dashboard**: View claims statistics and important notifications
- **Claims Management**: Process and review claims with Risk Assessment
- **Document Management**: Check and verify documents for fraud and forgery
- **Analytics Dashboard**: View insights and statistics into fraud and risk
- **User Management**: Handle user accounts and permissions

## Tech Stack

- **Frontend**: 
  - React.js
  - Tailwind CSS
  - Framer Motion (animations)
  - React Icons
  - Recharts (data visualization)

- **UI Components**:
  - Custom sidebar navigation
  - Responsive layouts
  - Modal dialogs
  - Interactive forms
  - Progress indicators

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JSON Web Token
  - Flask
  - TensorFlow
  - Keras
  - OpenCV
  - NLTK
  - Scikit-learn
  - Pandas
  - NumPy

## Installation Guide

### Prerequisites
Ensure you have the following installed on your system:
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
```
To run the frontend:
```sh
npm run dev  # or yarn dev
```
The frontend should be accessible at `http://localhost:5173`

### Step 3: Setup Backend
```sh
cd ../backend
npm install  # or yarn install
```
Create a `.env` file in the `backend` directory and configure the required environment variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key
```
To start the backend server:
```sh
npm run dev  # or yarn dev
```
The backend API should be available at `http://localhost:5000`

### Step 4: Setup AI Services (Flask)
```sh
cd ../ML-work
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
To run the AI service:
```sh
python main.py
```
The AI service should be running at `http://127.0.0.1:5001`

### Step 5: Run Anamoly Detection
```sh
python anomaly.py
```
The Anamoly Detection should be running at `http://127.0.0.1:5002`

### Troubleshooting
- Ensure MongoDB is running before starting the backend.
- If there are dependency issues, try reinstalling with `npm install` or `pip install -r requirements.txt`.
- Check if the ports are not occupied by other processes.

## Key Features Implementation

### Authentication
- Secure login/signup system
- JWT token-based authentication
- Protected routes

### Claims Management
- Multi-step claim submission form
- Document upload functionality
- bulk csv upload
- Risk Assessment
- Fraud Detection
- Document Verification
- Forgery Detection
- Claim status tracking
- History and timeline view

### Support System
- AI-powered chatbot
- FAQ system
- Real-time support chat

### UI/UX
- Responsive design
- Smooth animations
- Interactive components
- Loading states
- Error handling

