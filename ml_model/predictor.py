import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load dataset for yield prediction
yield_df = pd.read_excel("Crop_Data.xlsx")

# Define features and target for yield prediction
yield_features = ["Region", "Soil_Type", "Crop", "Rainfall_mm", "Temperature_Celsius", "Fertilizer_Used", "Irrigation_Used", "Weather_Condition", "Days_to_Harvest"]
yield_target = "Yield_tons_per_hectare"

# Ensure correct data types for yield prediction
yield_df["Rainfall_mm"] = yield_df["Rainfall_mm"].astype(float)
yield_df["Temperature_Celsius"] = yield_df["Temperature_Celsius"].astype(float)
yield_df["Days_to_Harvest"] = yield_df["Days_to_Harvest"].astype(float)
yield_df["Yield_tons_per_hectare"] = yield_df["Yield_tons_per_hectare"].astype(float)

# Convert categorical to numerical using one-hot encoding for yield prediction
yield_df = pd.get_dummies(yield_df, columns=["Region", "Soil_Type", "Crop", "Fertilizer_Used", "Irrigation_Used", "Weather_Condition"])

# Update the feature selection to include one-hot encoded columns for yield prediction
yield_encoded_features = list(yield_df.columns)
yield_encoded_features.remove(yield_target)

# Train model for yield prediction
X_yield = yield_df[yield_encoded_features]
y_yield = yield_df[yield_target]

X_yield_train, X_yield_test, y_yield_train, y_yield_test = train_test_split(X_yield, y_yield, test_size=0.2, random_state=42)
yield_model = RandomForestRegressor(n_estimators=100)
yield_model.fit(X_yield_train, y_yield_train)

# Load dataset for crop recommendation
recommend_df = pd.read_excel("crop_data.xlsx")

# Define features and target for crop recommendation
recommend_features = ["Region", "Soil_Type", "Rainfall_mm", "Temperature_Celsius", "Fertilizer_Used", "Irrigation_Used", "Weather_Condition", "Days_to_Harvest"]
recommend_target = "Crop"

# Ensure correct data types for crop recommendation
recommend_df["Rainfall_mm"] = recommend_df["Rainfall_mm"].astype(float)
recommend_df["Temperature_Celsius"] = recommend_df["Temperature_Celsius"].astype(float)
recommend_df["Days_to_Harvest"] = recommend_df["Days_to_Harvest"].astype(float)

# Convert categorical to numerical using one-hot encoding for crop recommendation
recommend_df = pd.get_dummies(recommend_df, columns=["Region", "Soil_Type", "Fertilizer_Used", "Irrigation_Used", "Weather_Condition"])

# Update the feature selection to include one-hot encoded columns for crop recommendation
recommend_encoded_features = list(recommend_df.columns)
recommend_encoded_features.remove(recommend_target)

# Train model for crop recommendation
X_recommend = recommend_df[recommend_encoded_features]
y_recommend = recommend_df[recommend_target]

X_recommend_train, X_recommend_test, y_recommend_train, y_recommend_test = train_test_split(X_recommend, y_recommend, test_size=0.2, random_state=42)
recommend_model = RandomForestClassifier(n_estimators=100)
recommend_model.fit(X_recommend_train, y_recommend_train)

@app.route("/predict_yield", methods=["POST"])
def predict_yield():
    data = request.get_json()
    input_features = pd.DataFrame([{
        "Region": data["Region"],
        "Soil_Type": data["Soil_Type"],
        "Crop": data["Crop"],
        "Rainfall_mm": float(data["Rainfall_mm"]),
        "Temperature_Celsius": float(data["Temperature_Celsius"]),
        "Fertilizer_Used": data["Fertilizer_Used"],
        "Irrigation_Used": data["Irrigation_Used"],
        "Weather_Condition": data["Weather_Condition"],
        "Days_to_Harvest": float(data["Days_to_Harvest"])
    }])

    # Apply the same encoding to input data
    input_features = pd.get_dummies(input_features)
    input_features = input_features.reindex(columns=X_yield_train.columns, fill_value=0)

    prediction = yield_model.predict(input_features)[0]
    return jsonify({"predicted_yield": prediction})

@app.route("/recommend_crop", methods=["POST"])
def recommend_crop():
    data = request.get_json()
    input_features = pd.DataFrame([{
        "Region": data["Region"],
        "Soil_Type": data["Soil_Type"],
        "Rainfall_mm": float(data["Rainfall_mm"]),
        "Temperature_Celsius": float(data["Temperature_Celsius"]),
        "Fertilizer_Used": data["Fertilizer_Used"],
        "Irrigation_Used": data["Irrigation_Used"],
        "Weather_Condition": data["Weather_Condition"],
        "Days_to_Harvest": float(data["Days_to_Harvest"])
    }])

    # Apply the same encoding to input data
    input_features = pd.get_dummies(input_features)
    input_features = input_features.reindex(columns=X_recommend_train.columns, fill_value=0)

    recommendation = recommend_model.predict(input_features)[0]
    return jsonify({"recommended_crop": recommendation})

if __name__ == "__main__":
    app.run(debug=True)
