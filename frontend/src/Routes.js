// src/Routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Allotments from './pages/Allotments';
import LastRanks from './pages/LastRanks';
import Fees from './pages/Fees';
import Colleges from './pages/Colleges';
import Courses from './pages/Courses';
import Wishlist from './pages/Wishlist';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allotments" element={<Allotments />} />
      <Route path="/last-ranks" element={<LastRanks />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/colleges" element={<Colleges />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
};

export default AppRoutes;
