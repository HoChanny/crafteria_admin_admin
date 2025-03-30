// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => (
  <div className="dashboard-container">
    <Sidebar />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

export default Dashboard;
