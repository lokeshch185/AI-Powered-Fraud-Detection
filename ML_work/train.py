import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib


def train_model():
    df = pd.read_csv("insurance_claims.csv")
    df["policy_start_date"] = pd.to_datetime(df["policy_start_date"])
    df["claim_date"] = pd.to_datetime(df["claim_date"])
    df["claim_duration"] = (df["claim_date"] - df["policy_start_date"]).dt.days
    df.drop(columns=["claim_id", "policy_start_date", "claim_date"], inplace=True)
    
    le_channel = LabelEncoder()
    df["channel"] = le_channel.fit_transform(df["channel"])
    
    le_fraud = LabelEncoder()
    df["fraud_category"] = le_fraud.fit_transform(df["fraud_category"])
    
    X = df.drop(columns=["fraud_category"])
    y = df["fraud_category"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    joblib.dump(model, "fraud_model.pkl")
    joblib.dump(scaler, "scaler.pkl")
    joblib.dump(le_channel, "label_encoder_channel.pkl")
    joblib.dump(le_fraud, "label_encoder_fraud.pkl")
    print("Model trained and saved successfully!")
    
train_model()