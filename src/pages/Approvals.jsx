import React, { useState } from "react";
import "./Approvals.css";

const Approvals = () => {
  // JSON formatted mock data with quotes
  const initialUsers = [
    { 
      "id": 101, 
      "email": "manufacturing@example.com", 
      "username": "제조사계정1", 
      "realname": "김제조", 
      "role": "DASHBOARD", 
      "status": "PENDING", 
      "companyName": "한국제조(주)", 
      "registerDate": "2025-06-30T10:00:00",
      "address": "서울시 강남구 테헤란로 123" 
    },
    { 
      "id": 102, 
      "email": "craftmaker@example.com", 
      "username": "제조계정2", 
      "realname": "이공장", 
      "role": "DASHBOARD", 
      "status": "PENDING", 
      "companyName": "크래프트메이커스", 
      "registerDate": "2025-06-29T15:30:00",
      "address": "서울시 마포구 월드컵북로 396" 
    },
    { 
      "id": 103, 
      "email": "3dprint@example.com", 
      "username": "프린트마스터", 
      "realname": "박프린터", 
      "role": "DASHBOARD", 
      "status": "PENDING", 
      "companyName": "3D프린팅솔루션", 
      "registerDate": "2025-06-28T09:15:00",
      "address": "부산시 해운대구 센텀중앙로 79" 
    },
    { 
      "id": 104, 
      "email": "modelmaker@example.com", 
      "username": "모델러", 
      "realname": "정모델", 
      "role": "DASHBOARD", 
      "status": "PENDING", 
      "companyName": "모델메이커스", 
      "registerDate": "2025-06-27T14:20:00",
      "address": "대구시 달서구 달구벌대로 1801" 
    },
    { 
      "id": 105, 
      "email": "creator3d@example.com", 
      "username": "크리에이터", 
      "realname": "최창작", 
      "role": "DASHBOARD", 
      "status": "PENDING", 
      "companyName": "크리에이티브3D", 
      "registerDate": "2025-06-26T11:45:00",
      "address": "인천시 연수구 송도미래로 30" 
    }
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const approveUser = (userId) => {
    if (window.confirm("이 사용자를 승인하시겠습니까?")) {
      // In a real implementation, this would call an API
      // For display purposes, just update state
      setUsers(users.filter(user => user.id !== userId));
      alert("승인이 완료되었습니다.");
    }
  };

  const rejectUser = (userId) => {
    if (window.confirm("이 사용자를 거절하시겠습니까?")) {
      // In a real implementation, this would call an API
      // For display purposes, just update state
      setUsers(users.filter(user => user.id !== userId));
      alert("거절이 완료되었습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="approvals-container">
      <div className="approvals-header">
        <h1>가입 / 업체 승인</h1>
        <div className="header-underline"></div>
      </div>
      
      <div className="approvals-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="이름, 회사명, 이메일 또는 주소로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="status-badge">
          <span className="pending-badge">{users.length}</span> 개의 승인 대기 
        </div>
      </div>
      
      <div className="table-container">
        <table className="approvals-table">
          <thead>
            <tr>
              <th>이메일</th>
              <th>사용자명</th>
              <th>실명</th>
              <th>회사명</th>
              <th>주소</th>
              <th>신청일</th>
              <th>승인처리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.realname}</td>
                  <td>{user.companyName}</td>
                  <td className="address-cell">{user.address}</td>
                  <td>{formatDate(user.registerDate)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="approve-button"
                        onClick={() => approveUser(user.id)}
                      >
                        승인
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => rejectUser(user.id)}
                      >
                        거절
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="7">검색 결과가 없거나 승인 대기 중인 유저가 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approvals;