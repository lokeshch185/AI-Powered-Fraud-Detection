from flask import Flask, jsonify, send_file, request
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from flask_cors import CORS
import io
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

def generate_plot_base64(plt):
    # Convert plot to base64 string
    buf = io.BytesIO()
    plt.savefig(buf, format='svg', bbox_inches='tight')
    buf.seek(0)
    plot_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return plot_data

@app.route('/api/fraud-analytics', methods=['GET', 'POST'])
def get_fraud_analytics():
    try:
        # Check if CSV file is provided in the request
        if request.method == 'POST' and 'file' in request.files:
            file = request.files['file']
            if file.filename.endswith('.csv'):
                df = pd.read_csv(file)
            else:
                return jsonify({
                    "status": "error",
                    "message": "Please upload a valid CSV file"
                }), 400
        else:
            # Use database data if no CSV is provided
            df = pd.read_csv("insurance_claims.csv")

        if df.empty:
            return jsonify({
                "status": "error",
                "message": "No data available for analysis"
            }), 400

        # Rest of your analysis code remains the same
        features_for_analysis = [
            'age', 'premium_amount', 'sum_assured', 'income',
            'channel', 'product_type'
        ]
        
        df_analysis = df[features_for_analysis].copy()

        # Encoding categorical variables
        le_channel = LabelEncoder()
        le_product = LabelEncoder()
        
        df_analysis['channel'] = le_channel.fit_transform(df_analysis['channel'])
        df_analysis['product_type'] = le_product.fit_transform(df_analysis['product_type'])

        # Standardize numeric data
        numeric_cols = df_analysis.select_dtypes(include=[np.number]).columns.tolist()
        scaler = StandardScaler()
        df_scaled = scaler.fit_transform(df_analysis[numeric_cols])

        # K-Means Clustering
        kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(df_scaled)
        df_analysis["cluster"] = clusters

        # PCA for visualization
        pca = PCA(n_components=2)
        reduced_data = pca.fit_transform(df_scaled)
        df_analysis["pca1"] = reduced_data[:, 0]
        df_analysis["pca2"] = reduced_data[:, 1]

        # Generate plots and convert to base64
        plots = {}

        # 1. Scatter Plot of Clusters
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x=df_analysis["pca1"], y=df_analysis["pca2"], hue=df_analysis["cluster"], 
                       palette="viridis", alpha=0.7)
        plt.title("Fraud Detection Clusters (PCA Reduced)")
        plt.xlabel("Principal Component 1")
        plt.ylabel("Principal Component 2")
        plots["cluster_scatter"] = generate_plot_base64(plt)

        # 2. Cluster Size Distribution
        plt.figure(figsize=(8, 5))
        sns.countplot(x="cluster", data=df_analysis, palette="coolwarm")
        plt.title("Cluster Size Distribution")
        plt.xlabel("Cluster")
        plt.ylabel("Number of Data Points")
        plots["cluster_distribution"] = generate_plot_base64(plt)

        # 3. Feature Distributions
        available_features = [f for f in ["age", "premium_amount", "sum_assured", "income"] 
                            if f in df_analysis.columns]
        feature_plots = {}
        for feature in available_features:
            plt.figure(figsize=(8, 5))
            sns.boxplot(x=df_analysis["cluster"], y=df_analysis[feature], palette="Set2")
            plt.title(f"Distribution of {feature} Across Clusters")
            plt.xlabel("Cluster")
            plt.ylabel(feature)
            feature_plots[feature] = generate_plot_base64(plt)
        plots["feature_distributions"] = feature_plots

        # 4. Correlation Heatmap
        plt.figure(figsize=(10, 8))
        sns.heatmap(df_analysis.corr(), annot=True, cmap="coolwarm", fmt=".2f")
        plt.title("Feature Correlation Heatmap")
        plots["correlation_heatmap"] = generate_plot_base64(plt)

        # Calculate summary statistics
        summary_stats = {
            "total_claims": len(df_analysis),
            "cluster_sizes": df_analysis["cluster"].value_counts().to_dict(),
            "avg_premium": df_analysis["premium_amount"].mean(),
            "total_sum_assured": df_analysis["sum_assured"].sum()
        }

        return jsonify({
            "status": "success",
            "plots": plots,
            "summary": summary_stats,
            "analysis_date": datetime.now().isoformat(),
            "data_source": "csv" if request.method == 'POST' else "database"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
