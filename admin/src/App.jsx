import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import CowPricing from './pages/CowPricing';
import Bhandara from './pages/Bhandara';
import Gurukul from './pages/Gurukul';
import Karyakarta from './pages/Karyakarta';
import Students from './pages/Students';
import Accounting from './pages/Accounting';
import Memberships from './pages/Memberships';
import MembershipDetail from './pages/MembershipDetail';
import MembershipPlans from './pages/MembershipPlans';
import Content from './pages/Content';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="cow-pricing" element={<CowPricing />} />
          <Route path="bhandara" element={<Bhandara />} />
          <Route path="gurukul" element={<Gurukul />} />
          <Route path="karyakarta" element={<Karyakarta />} />
          <Route path="students" element={<Students />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="memberships/:id" element={<MembershipDetail />} />
          <Route path="membership-plans" element={<MembershipPlans />} />
          <Route path="content" element={<Content />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
