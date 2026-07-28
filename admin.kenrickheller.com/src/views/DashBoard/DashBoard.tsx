import React, { useEffect } from 'react';
import './DashBoard.css';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import useProfile from 'src/hooks/useProfile';

window.addEventListener('contextmenu', (e) => e.preventDefault());

const DashBoard: React.FC = () => {
  //Value
  const profile = useProfile();

  //Main
  return !profile ? <Navigate to="/auth" /> : <div className="container-fluid"></div>;
};

export default DashBoard;
