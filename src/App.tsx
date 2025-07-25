import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import EnhancedBuddhistLanding from './components/EnhancedBuddhistLanding';
import TempleReviewPage from './pages/TempleReviewPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EnhancedBuddhistLanding />} />
          <Route path="/temple-reviews" element={<TempleReviewPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;