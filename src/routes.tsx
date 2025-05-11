import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoutes';
import Following from './pages/Following';

export const RoutesRenderer: React.FC = () => (
  <Routes>
    {/* public */}
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<Search />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* private */}
    <Route path="/following" element={
      <PrivateRoute><Following /></PrivateRoute>
    }/>
    <Route path="/profile/:userId" element={
      <PrivateRoute><Profile /></PrivateRoute>
    }/>

    {/* fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
