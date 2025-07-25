import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import BuddhistCommunity2025 from './components/BuddhistCommunity2025';
import TempleReviewPage from './pages/TempleReviewPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BuddhistCommunity2025 />} />
          <Route path="/temple-reviews" element={<TempleReviewPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;