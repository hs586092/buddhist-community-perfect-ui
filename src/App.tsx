import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import BuddhistCommunityLanding from './components/BuddhistCommunityLanding';
import TempleReviewPage from './pages/TempleReviewPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BuddhistCommunityLanding />} />
          <Route path="/temple-reviews" element={<TempleReviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;