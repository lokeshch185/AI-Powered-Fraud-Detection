import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# Function to detect anomalies and visualize clusters
def detect_anomalies():
    # Load dataset
    df = pd.read_csv("insurance_claims.csv")
    df.drop(columns=["claim_id", "policy_start_date", "claim_date", "fraud_category"], errors="ignore", inplace=True)

    # Encoding categorical variable
    le_channel = LabelEncoder()
    if "channel" in df.columns:
        df["channel"] = le_channel.fit_transform(df["channel"])

    # Standardize numeric data
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df[numeric_cols])

    # K-Means Clustering
    kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(df_scaled)

    df["cluster"] = clusters

    # Save clusters
    df.to_csv("fraud_clusters.csv", index=False)
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
    plt.savefig("fraud_clusters_pca.png")
    print("📊 PCA Scatter Plot Saved as fraud_clusters_pca.png")
    plt.show()

    # 📌 2. Cluster Size Distribution (Fix Seaborn Warning)
    plt.figure(figsize=(8, 5))
    sns.countplot(x="cluster", data=df, palette="coolwarm")
    plt.title("Cluster Size Distribution")
    plt.xlabel("Cluster")
    plt.ylabel("Number of Data Points")
    plt.savefig("cluster_distribution.png")
    print("📊 Cluster Size Distribution Saved as cluster_distribution.png")
    plt.show()

    # 📌 3. Feature Distributions by Cluster (Only Use Available Numeric Features)
    available_features = [feature for feature in ["amount_claimed", "age", "premium_amount"] if feature in df.columns]
    if available_features:
        for feature in available_features:
            plt.figure(figsize=(8, 5))
            sns.boxplot(x=df["cluster"], y=df[feature], palette="Set2")
            plt.title(f"Distribution of {feature} Across Clusters")
            plt.xlabel("Cluster")
            plt.ylabel(feature)
            plt.savefig(f"{feature}_distribution.png")
            print(f"📊 {feature} Distribution Saved as {feature}_distribution.png")
            plt.show()
    else:
        print("⚠ No valid numeric columns found for feature distribution plots.")

    # # 📌 4. Pairplot for Cluster Relationships
    # pairplot_features = ["pca1", "pca2"] + available_features + ["cluster"]
    # sns.pairplot(df[pairplot_features], hue="cluster", palette="tab10")
    # plt.savefig("pairplot_clusters.png")
    # print("📊 Pairplot Saved as pairplot_clusters.png")
    # plt.show()

# Run function
detect_anomalies()
