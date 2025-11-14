import React , {useEffect} from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgotPassword';
import { initGA } from './utils/analytics';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  var getlocalsession = localStorage.getItem('flaponeloginDetails');
  if(getlocalsession){
    var  getSavedLocalData = JSON.parse(atob(atob(localStorage.getItem('flaponeloginDetails'))));
  }
  else{
    var  getSavedLocalData ='';
  }
    if (getSavedLocalData) {
      dispatch(setUser(getSavedLocalData));
    }
  const isLoggedIn = useSelector((state) => state.auth.userid!==null);

  useEffect(() => {
    // Initialize Google Analytics
    initGA();

    // Track a page view
    window.gtag('config', 'G-EH3W0WJ4YX1', {
      page_path: window.location.pathname,
    });
  
     if (isLoggedIn && location.pathname === "/") {
      navigate("/my-account", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/:id" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {isLoggedIn ? (
          <Route path="/*" element={<Layout />} />
        ) : (
          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <Layout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        )}
      </Routes>
  );
}

export default App;
