// src/Routes.js
import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
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
import { UserContext } from './contexts/UserContext';
import FileUpload from './components/Upload';
import AdminControls from './components/adminControls';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/allotments" element={<PrivateRoute><Allotments /></PrivateRoute>} />
      <Route path="/last-ranks" element={<PrivateRoute><LastRanks /></PrivateRoute>} />
      <Route path="/fees" element={<PrivateRoute><Fees /></PrivateRoute>} />
      <Route path="/colleges" element={<PrivateRoute><Colleges /></PrivateRoute>} />
      <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
      <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
      <Route path="/fileupload" element={< FileUpload/>}/>
      <Route path="/adminControls" element={< AdminControls/>}/>
    </Routes>
  );
};

export default AppRoutes;

