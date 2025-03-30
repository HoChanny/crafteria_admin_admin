import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Users from "./pages/Users";
import Approvals from "./pages/Approvals";
import Delivery from "./pages/Delivery";
import Ads from "./pages/Ads";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  
  // Listen for authentication changes
  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
    };
    
    // Check initially and set up event listener
    checkAuth();
    
    // Add event listener for storage changes (logout from other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for logout from this tab
    window.addEventListener('app:logout', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('app:logout', checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <Login />} />
        {authenticated ? (
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<Posts />} />
            <Route path="users" element={<Users />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="ads" element={<Ads />} />
            <Route path="*" element={<Navigate to="posts" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;