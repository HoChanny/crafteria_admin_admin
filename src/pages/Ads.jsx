import React, { useState } from "react";
import "./Ads.css";

const Ads = () => {
  // Simplified mock advertisement data
  const initialAds = [
    {
      id: 1,
      name: "메인 배너 광고",
      imageUrl: "https://via.placeholder.com/800x400",
      linkUrl: "https://example.com/main-promo"
    },
    {
      id: 2, 
      name: "사이드 배너 A",
      imageUrl: "https://via.placeholder.com/300x600",
      linkUrl: "https://example.com/side-banner"
    },
    {
      id: 3,
      name: "제품 목록 광고",
      imageUrl: "https://via.placeholder.com/600x300",
      linkUrl: "https://example.com/products-promo"
    },
    {
      id: 4,
      name: "회원가입 프로모션",
      imageUrl: "https://via.placeholder.com/400x300",
      linkUrl: "https://example.com/signup-promo"
    },
    {
      id: 5,
      name: "푸터 배너",
      imageUrl: "https://via.placeholder.com/900x150",
      linkUrl: "https://example.com/footer-banner"
    }
  ];

  const [ads, setAds] = useState(initialAds);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [newAdForm, setNewAdForm] = useState({
    name: "",
    linkUrl: ""
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewAdForm({
      ...newAdForm,
      [name]: value
    });
  };

  // Handle ad upload
  const handleAdUpload = () => {
    if (!selectedFile) {
      alert("광고 이미지를 선택해주세요.");
      return;
    }
    
    if (!newAdForm.name || !newAdForm.linkUrl) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // Create new ad
    const newAd = {
      id: ads.length + 1,
      name: newAdForm.name,
      imageUrl: filePreview || "https://via.placeholder.com/400x200",
      linkUrl: newAdForm.linkUrl
    };

    // Add to ads list
    setAds([...ads, newAd]);
    
    // Reset form
    setSelectedFile(null);
    setFilePreview(null);
    setNewAdForm({
      name: "",
      linkUrl: ""
    });

    alert("광고가 성공적으로 등록되었습니다.");
  };

  // Delete an ad
  const handleDeleteAd = (adId) => {
    if (window.confirm("이 광고를 삭제하시겠습니까?")) {
      setAds(ads.filter(ad => ad.id !== adId));
      alert("광고가 삭제되었습니다.");
    }
  };

  // Filter ads based on search term
  const filteredAds = ads.filter(ad => 
    ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.linkUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ads-container">
      <div className="ads-header">
        <h1>광고 관리</h1>
        <div className="header-underline"></div>
      </div>
      
      <div className="ads-sections">
        {/* Left section - Upload and form */}
        <div className="ads-upload-section">
          <h2>새 광고 등록</h2>
          
          <div className="upload-preview">
            {filePreview ? (
              <img src={filePreview} alt="Preview" />
            ) : (
              <div className="empty-preview">
                <span>이미지 미리보기</span>
              </div>
            )}
          </div>
          
          <div className="file-upload">
            <label className="file-label">
              <span>이미지 선택</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="file-input" 
              />
            </label>
            {selectedFile && (
              <span className="file-name">{selectedFile.name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label>광고 이름</label>
            <input 
              type="text" 
              name="name" 
              value={newAdForm.name} 
              onChange={handleFormChange} 
              placeholder="광고 이름을 입력하세요"
            />
          </div>
          
          <div className="form-group">
            <label>링크 URL</label>
            <input 
              type="url" 
              name="linkUrl" 
              value={newAdForm.linkUrl} 
              onChange={handleFormChange} 
              placeholder="https://example.com"
            />
          </div>
          
          <button 
            className="upload-button" 
            onClick={handleAdUpload}
          >
            광고 등록하기
          </button>
        </div>
        
        {/* Right section - Existing ads */}
        <div className="ads-list-section">
          <div className="ads-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="이름 또는 URL로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="ads-count">
              총 <span className="count-number">{filteredAds.length}</span>개의 광고
            </div>
          </div>
          
          <div className="ads-grid">
            {filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
                <div className="ad-card" key={ad.id}>
                  <div className="ad-image">
                    <img src={ad.imageUrl} alt={ad.name} />
                  </div>
                  <div className="ad-info">
                    <h3>{ad.name}</h3>
                    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="ad-link">
                      {ad.linkUrl}
                    </a>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteAd(ad.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-ads">
                <p>등록된 광고가 없거나 검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ads;