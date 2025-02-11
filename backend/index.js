const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const cropRoutes = require("./routes/cropRoutes");
app.use("/api/crops", cropRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Farmer Portal Backend Running...");
});

// API for Yield Prediction
app.post("/predict_yield", async (req, res) => {
    try {
        const { Region, Soil_Type, Crop, Rainfall_mm, Temperature_Celsius, Fertilizer_Used, Irrigation_Used, Weather_Condition, Days_to_Harvest } = req.body;

        // Prepare the data to be sent to the ML model (Flask API)
        console.log("1st thing happened!!");
        const data = {
            Region, Soil_Type, Crop, Rainfall_mm, Temperature_Celsius, Fertilizer_Used, Irrigation_Used, Weather_Condition, Days_to_Harvest
        };

        // Send data to Flask API for prediction
        const response = await axios.post("http://127.0.0.1:5001/predict_yield", data);
        console.log("2nd thing happened!!");

        // Get predicted yield from the Flask response and send it to the frontend
        const predicted_yield = response.data.predicted_yield;
        console.log("3rd thing happened!!");
        res.json({ predicted_yield });
    } catch (error) {
        console.log("Error in backend");
        console.error(error);
        res.status(500).send("Error while processing prediction");
    }
});

// API for Crop Recommendation
app.post("/recommend_crop", async (req, res) => {
    try {
        const { Region, Soil_Type, Rainfall_mm, Temperature_Celsius, Fertilizer_Used, Irrigation_Used, Weather_Condition, Days_to_Harvest } = req.body;

        // Prepare the data to be sent to the ML model (Flask API)
        console.log("1st thing happened!!");
        const data = {
            Region, Soil_Type, Rainfall_mm, Temperature_Celsius, Fertilizer_Used, Irrigation_Used, Weather_Condition, Days_to_Harvest
        };

        // Send data to Flask API for recommendation
        const response = await axios.post("http://127.0.0.1:5001/recommend_crop", data);
        console.log("2nd thing happened!!");

        // Get recommended crop from the Flask response and send it to the frontend
        const recommended_crop = response.data.recommended_crop;
        console.log("3rd thing happened!!");
        res.json({ recommended_crop });
    } catch (error) {
        console.log("Error in backend");
        console.error(error);
        res.status(500).send("Error while processing recommendation");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
