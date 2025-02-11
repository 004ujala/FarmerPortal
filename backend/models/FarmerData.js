const mongoose = require("mongoose");

const FarmerDataSchema = new mongoose.Schema({
    farmerName: String,
    soilType: String,
    location: String,
    weatherConditions: String,
    cropType: String,
    pestRisk: String,
    yieldPrediction: Number,
});

module.exports = mongoose.model("FarmerData", FarmerDataSchema);
