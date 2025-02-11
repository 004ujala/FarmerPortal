import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import YieldPredictionForm from './components/YieldPredictionForm';
import CropRecommendationForm from './components/CropRecommendationForm';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Farmer Portal</h1>
          <nav>
            <ul>
              <li>
                <Link to="/yield-prediction">Yield Prediction</Link>
              </li>
              <li>
                <Link to="/crop-recommendation">Crop Recommendation</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/yield-prediction" element={
              <>
                <h3>Crop Yield Prediction</h3>
                <YieldPredictionForm />
              </>
            } />
            <Route path="/crop-recommendation" element={
              <>
                <h3>Crop Recommendation</h3>
                <CropRecommendationForm />
              </>
            } />
            <Route path="/" element={
              <>
                <h2>Welcome to the Farmer Portal</h2>
                <p>Please select a feature from the menu above.</p>
              </>
            } />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
