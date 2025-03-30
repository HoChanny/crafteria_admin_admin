import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setAuthenticated } from "../utils/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    
    // Dispatch a custom event to notify App.jsx that auth state changed
    window.dispatchEvent(new Event('app:logout'));
    
    navigate("/login");
  };

  const menuItems = [
    { to: "/posts", label: "글 목록", emoji: "📄" },
    { to: "/users", label: "회원 목록", emoji: "👥" },
    { to: "/approvals", label: "가입 / 업체 승인", emoji: "✅" },
    { to: "/delivery", label: "배송 관리", emoji: "🚚" },
    { to: "/ads", label: "광고 관리", emoji: "📊" }
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2>관리자 메뉴</h2>
        <div className="header-underline"></div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="logout-icon">🚪</span>
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
