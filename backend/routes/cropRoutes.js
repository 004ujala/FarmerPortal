const express = require("express");
const router = express.Router();
const axios = require("axios");

// Route to interact with AI Model
router.post("/predict", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/predict", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
