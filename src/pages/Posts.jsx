import React, { useState } from "react";
import "./Posts.css";

const Posts = () => {
  // Mock data for 3D model moderations with JSON formatted strings
  const mockPosts = [
    { 
      "id": 1, 
      "title": "게임 캐릭터 무기 모델", 
      "description": "FPS 게임의 무기 디자인 모델입니다.", 
      "author": "김모델러", 
      "uploadDate": "2025-07-01T10:00:00",
      "modelFileUrl": "https://example.com/models/model1.stl"
    },
    { 
      "id": 2, 
      "title": "미니어처 피규어", 
      "description": "판타지 게임 캐릭터 피규어 모델입니다.", 
      "author": "이디자이너", 
      "uploadDate": "2025-06-28T14:30:00",
      "modelFileUrl": "https://example.com/models/model2.stl"
    },
    { 
      "id": 3, 
      "title": "기계 부품 모델", 
      "description": "3D 프린팅 가능한 엔진 부품 모델입니다.", 
      "author": "박엔지니어", 
      "uploadDate": "2025-06-25T09:15:00",
      "modelFileUrl": "https://example.com/models/model3.stl"
    },
    { 
      "id": 4, 
      "title": "아트 오브젝트", 
      "description": "현대적 아트 장식 오브젝트입니다.", 
      "author": "최아티스트", 
      "uploadDate": "2025-06-20T11:45:00",
      "modelFileUrl": "https://example.com/models/model4.stl"
    },
    { 
      "id": 5, 
      "title": "키체인 디자인", 
      "description": "커스텀 키체인 제작용 모델입니다.", 
      "author": "정디자이너", 
      "uploadDate": "2025-06-15T16:30:00",
      "modelFileUrl": "https://example.com/models/model5.stl"
    }
  ];

  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("이 3D 모델을 삭제하시겠습니까? 불법 또는 부적절한 콘텐츠인 경우 삭제해주세요.")) {
      // TODO: Implement API call to delete the model
      // DELETE /api/v1/model/{modelId}
      // For now, just remove from UI state
      setPosts(posts.filter(post => post.id !== id));
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

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>3D 모델 콘텐츠 관리</h1>
        <div className="header-underline"></div>
      </div>
      
      <div className="posts-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="제목, 설명 또는 작성자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="count-info">
          <span className="count-badge">{posts.length}</span> 3D 모델 콘텐츠
        </div>
      </div>
      
      <div className="table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>설명</th>
              <th>작성자</th>
              <th>업로드일</th>
              <th>3D 모델</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td className="description-cell">{post.description}</td>
                  <td>{post.author}</td>
                  <td>{formatDate(post.uploadDate)}</td>
                  <td>
                    <a href={post.modelFileUrl} className="view-model-btn" target="_blank" rel="noopener noreferrer">
                      모델 확인
                    </a>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(post.id)}
                      title="불법 또는 부적절한 콘텐츠 삭제"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="6">검색 결과가 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posts;
