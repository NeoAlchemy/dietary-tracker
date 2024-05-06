import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import Tracker from './components/Tracker.jsx'
import History from './components/History.jsx'

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/history" element={<History />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
