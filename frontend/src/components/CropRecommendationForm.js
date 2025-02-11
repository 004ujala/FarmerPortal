import React, { useState } from 'react';
import cropService from '../services/cropService'; // Import cropService for API call
import '../CR.css'; // Import the styles

const CropRecommendationForm = () => {
    const [region, setRegion] = useState('');
    const [soilType, setSoilType] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [temperature, setTemperature] = useState('');
    const [fertilizerUsed, setFertilizerUsed] = useState('');
    const [irrigationUsed, setIrrigationUsed] = useState('');
    const [weatherCondition, setWeatherCondition] = useState('');
    const [daysToHarvest, setDaysToHarvest] = useState('');
    const [recommendedCrop, setRecommendedCrop] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            Region: region,
            Soil_Type: soilType,
            Rainfall_mm: parseFloat(rainfall),
            Temperature_Celsius: parseFloat(temperature),
            Fertilizer_Used: fertilizerUsed,
            Irrigation_Used: irrigationUsed,
            Weather_Condition: weatherCondition,
            Days_to_Harvest: parseFloat(daysToHarvest),
        };

        try {
            const response = await cropService.getRecommendation(data);
            setRecommendedCrop(response.data.recommended_crop);
            console.log("done in frontend side!!");
        } catch (error) {
            console.error("Error fetching recommendation:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommendation-form">
            <h2>Farmer Portal - Crop Recommendation</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Soil Type"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Rainfall (mm)"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Temperature (°C)"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Fertilizer Used"
                    value={fertilizerUsed}
                    onChange={(e) => setFertilizerUsed(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Irrigation Used"
                    value={irrigationUsed}
                    onChange={(e) => setIrrigationUsed(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Weather Condition"
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Days to Harvest"
                    value={daysToHarvest}
                    onChange={(e) => setDaysToHarvest(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Predicting...' : 'Get Recommendation'}
                </button>
            </form>

            {recommendedCrop && (
                <div className="result">
                    <h3>Recommended Crop: {recommendedCrop}</h3>
                </div>
            )}
        </div>
    );
};

export default CropRecommendationForm;
