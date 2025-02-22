import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def detect_anomalies():
    df = pd.read_csv("insurance_claims.csv")
    df.drop(columns=["claim_id", "policy_start_date", "claim_date", "fraud_category"], errors="ignore", inplace=True)

    # Create output folder
    output_folder = "fraud_analysis_charts"
    os.makedirs(output_folder, exist_ok=True)

    # Encoding categorical variables
    le_channel = LabelEncoder()
    le_product = LabelEncoder()
    
    if "channel" in df.columns:
        df["channel"] = le_channel.fit_transform(df["channel"])
    if "product_type" in df.columns:
        df["product_type"] = le_product.fit_transform(df["product_type"])

    # Standardize numeric data
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df[numeric_cols])

    # K-Means Clustering
    kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(df_scaled)
    df["cluster"] = clusters

    # Save clusters
    df.to_csv(os.path.join(output_folder, "fraud_clusters.csv"), index=False)
    print("✅ Anomaly detection completed. Clusters saved as fraud_clusters.csv")

    # PCA for 2D Visualization
    pca = PCA(n_components=2)
    reduced_data = pca.fit_transform(df_scaled)
    df["pca1"] = reduced_data[:, 0]
    df["pca2"] = reduced_data[:, 1]

    # 📌 1. Scatter Plot of Clusters
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x=df["pca1"], y=df["pca2"], hue=df["cluster"], palette="viridis", alpha=0.7)
    plt.title("Fraud Detection Clusters (PCA Reduced)")
    plt.xlabel("Principal Component 1")
    plt.ylabel("Principal Component 2")
    plt.legend(title="Cluster")
    plt.savefig(os.path.join(output_folder, "fraud_clusters_pca.svg"), format="svg")
    plt.show()

    # 📌 2. Cluster Size Distribution
    plt.figure(figsize=(8, 5))
    sns.countplot(x="cluster", data=df, palette="coolwarm")
    plt.title("Cluster Size Distribution")
    plt.xlabel("Cluster")
    plt.ylabel("Number of Data Points")
    plt.savefig(os.path.join(output_folder, "cluster_distribution.svg"), format="svg")
    plt.show()

    # 📌 3. Feature Distributions by Cluster
    available_features = [feature for feature in ["age", "premium_amount", "sum_assured", "income"] if feature in df.columns]
    if available_features:
        for feature in available_features:
            plt.figure(figsize=(8, 5))
            sns.boxplot(x=df["cluster"], y=df[feature], palette="Set2")
            plt.title(f"Distribution of {feature} Across Clusters")
            plt.xlabel("Cluster")
            plt.ylabel(feature)
            plt.savefig(os.path.join(output_folder, f"{feature}_distribution.svg"), format="svg")
            plt.show()
    else:
        print("⚠ No valid numeric columns found for feature distribution plots.")

    # 📌 4. Correlation Heatmap
    plt.figure(figsize=(10, 8))
    sns.heatmap(df.corr(), annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Feature Correlation Heatmap")
    plt.savefig(os.path.join(output_folder, "correlation_heatmap.svg"), format="svg")
    plt.show()

    # 📌 6. Violin Plot for Claim Amount Distribution by Cluster
    plt.figure(figsize=(8, 5))
    sns.violinplot(x=df["cluster"], y=df["sum_assured"], palette="muted")
    plt.title("Claim Amount Distribution by Cluster")
    plt.xlabel("Cluster")
    plt.ylabel("Sum Assured")
    plt.savefig(os.path.join(output_folder, "claim_amount_violin.svg"), format="svg")
    plt.show()

    # 📌 7. Histogram of Premium Amount Distribution
    plt.figure(figsize=(8, 5))
    sns.histplot(df["premium_amount"], bins=30, kde=True, color="blue")
    plt.title("Premium Amount Distribution")
    plt.xlabel("Premium Amount")
    plt.ylabel("Frequency")
    plt.savefig(os.path.join(output_folder, "premium_distribution.svg"), format="svg")
    plt.show()

# Run function
detect_anomalies()
