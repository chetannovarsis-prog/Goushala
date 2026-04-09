import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CowDonation from './pages/CowDonation';
import Bhandara from './pages/Bhandara';
import Gurukul from './pages/Gurukul';
import Membership from './pages/Membership';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate-cow" element={<CowDonation />} />
            <Route path="/bhandara" element={<Bhandara />} />
            <Route path="/gurukul" element={<Gurukul />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
