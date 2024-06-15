import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Allotments from './pages/Allotments';
import LastRanks from './pages/LastRanks';
import Fees from './pages/Fees';
import Courses from './pages/Courses';
import Institutes from './pages/Institutes';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import Register from './pages/Register'; 
import UserProfile from './pages/UserProfile'; // Import the UserProfile page
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/allotments" element={<Allotments />} />
      <Route path="/last-ranks" element={<LastRanks />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/institutes" element={<Institutes />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user-profile" element={<PrivateRoute element={UserProfile} />} />
      <Route path="/admin" element={<PrivateRoute element={AdminPanel} />} />
    </Routes>
  </Router>
);

export default AppRoutes;
