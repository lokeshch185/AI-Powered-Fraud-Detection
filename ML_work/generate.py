import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib


def generate_fake_data(num_samples=10000):
    fraud_types = ["No Fraud", "Early Death Claim", "High Sum Assured Ratio", "Age-Based Risk", "Channel-Based Fraud", "Income Mismatch"]
    product_types = ["Health", "Non Par", "Pension", "Traditional", "ULIP", "Variable"]
    
    data = []
    for _ in range(num_samples):
        claim_id = f"CLM{random.randint(100000, 999999)}"
        policy_start_date = datetime.today() - timedelta(days=random.randint(1, 1000))
        claim_date = policy_start_date + timedelta(days=random.randint(10, 400))
        age = random.randint(18, 80)
        premium_amount = random.randint(1000, 50000)
        sum_assured = premium_amount * random.uniform(10, 50)
        income = random.randint(100000, 10000000)
        channel = random.choice(["RetailAgency", "Bancassurance"])
        product_type = random.choice(product_types)
        
        early_death_claim = (claim_date - policy_start_date).days <= 180
        high_sum_ratio = (sum_assured / premium_amount > 30)
        age_based_risk = (age in range(20, 35) and sum_assured > 500000)
        channel_fraud = (channel == "RetailAgency" and random.random() < 0.2)
        income_mismatch = (income < 500000 and sum_assured > 5000000)
        
        fraud_category = "No Fraud"
        if early_death_claim:
            fraud_category = "Early Death Claim"
        elif high_sum_ratio:
            fraud_category = "High Sum Assured Ratio"
        elif age_based_risk:
            fraud_category = "Age-Based Risk"
        elif channel_fraud:
            fraud_category = "Channel-Based Fraud"
        elif income_mismatch:
            fraud_category = "Income Mismatch"
        
        data.append([claim_id, policy_start_date, claim_date, age, premium_amount, sum_assured, income, channel, product_type, fraud_category])
    
    df = pd.DataFrame(data, columns=["claim_id", "policy_start_date", "claim_date", "age", "premium_amount", "sum_assured", "income", "channel", "product_type", "fraud_category"])
    df.to_csv("insurance_claims.csv", index=False)
    print("Dataset generated and saved as insurance_claims.csv")


generate_fake_data()