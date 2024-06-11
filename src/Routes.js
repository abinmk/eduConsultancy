// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Allotments from './pages/Allotments';
import LastRanks from './pages/LastRanks';
import Fees from './pages/Fees';
import Courses from './pages/Courses';
import Institutes from './pages/Institutes';
import Announcements from './pages/Announcements';

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
    </Routes>
  </Router>
);

export default AppRoutes;
