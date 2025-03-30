import React, { useState } from "react";
import "./Users.css";

const Users = () => {
  // Mock data for users with JSON formatted strings
  const mockUsers = [
    { 
      "id": 1, 
      "username": "user1", 
      "email": "user1@example.com", 
      "realname": "김유저", 
      "role": "USER", 
      "registerDate": "2025-06-28T14:30:00",
      "address": "서울시 강남구"
    },
    { 
      "id": 2, 
      "username": "designer1", 
      "email": "designer1@example.com", 
      "realname": "이디자이너", 
      "role": "USER", 
      "registerDate": "2025-06-25T09:15:00",
      "address": "서울시 용산구"
    },
    { 
      "id": 3, 
      "username": "creator3d", 
      "email": "creator@example.com", 
      "realname": "박창작", 
      "role": "USER", 
      "registerDate": "2025-06-20T11:45:00",
      "address": "부산시 해운대구"
    },
    { 
      "id": 4, 
      "username": "manufacturer", 
      "email": "manufacturer@example.com", 
      "realname": "최제조", 
      "role": "DASHBOARD", 
      "registerDate": "2025-06-15T16:30:00",
      "address": "대구시 수성구"
    },
    { 
      "id": 5, 
      "username": "premium_user", 
      "email": "premium@example.com", 
      "realname": "정프리미엄", 
      "role": "USER", 
      "registerDate": "2025-06-10T11:30:00",
      "address": "인천시 남동구"
    }
  ];

  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteUser = (id) => {
    if (window.confirm("정말 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // TODO: Implement API call to delete the user
      // DELETE /api/v1/users/{userId}
      // For now, just remove from UI state
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case "ADMIN":
        return <span className="role-badge admin">관리자</span>;
      case "DASHBOARD":
        return <span className="role-badge dashboard">제조사</span>;
      default:
        return <span className="role-badge user">일반회원</span>;
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>회원 목록</h1>
        <div className="header-underline"></div>
      </div>
      
      <div className="users-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="아이디 또는 주소로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="count-info">
          <span className="count-badge">{users.length}</span> 회원
        </div>
      </div>
      
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>아이디</th>
              <th>주소</th>
              <th>역할</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td className="address-cell">{user.address}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                      title="회원 삭제"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="4">검색 결과가 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
