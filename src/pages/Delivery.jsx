import React, { useState } from "react";
import "./Delivery.css";

const Delivery = () => {
  // Mock delivery data
  const initialDeliveries = [
    {
      id: 1,
      orderNumber: "ORD-2025-001",
      customerName: "김민준",
      address: "서울시 강남구 테헤란로 123",
      items: "커스텀 화분 A, 다육식물 세트",
      status: "PENDING",
      orderDate: "2025-06-30T10:00:00",
      deliveryDate: null,
      trackingNumber: null
    },
    {
      id: 2,
      orderNumber: "ORD-2025-002",
      customerName: "이지현",
      address: "서울시 마포구 월드컵북로 396",
      items: "원목 선반, 행잉 플랜트",
      status: "SHIPPING",
      orderDate: "2025-06-29T15:30:00",
      deliveryDate: "2025-07-02",
      trackingNumber: "CJ12345678"
    },
    {
      id: 3,
      orderNumber: "ORD-2025-003",
      customerName: "박서준",
      address: "부산시 해운대구 센텀중앙로 79",
      items: "3D 프린팅 화분, 다육식물",
      status: "DELIVERED",
      orderDate: "2025-06-28T09:15:00",
      deliveryDate: "2025-06-30",
      trackingNumber: "LO98765432"
    },
    {
      id: 4,
      orderNumber: "ORD-2025-004",
      customerName: "최예은",
      address: "대구시 달서구 달구벌대로 1801",
      items: "원목 화분 스탠드, 에어플랜트",
      status: "PENDING",
      orderDate: "2025-06-27T14:20:00",
      deliveryDate: null,
      trackingNumber: null
    },
    {
      id: 5,
      orderNumber: "ORD-2025-005",
      customerName: "정도현",
      address: "인천시 연수구 송도미래로 30",
      items: "테라리움 세트, 미니 선인장",
      status: "SHIPPING",
      orderDate: "2025-06-26T11:45:00",
      deliveryDate: "2025-06-29",
      trackingNumber: "HD56781234"
    }
  ];

  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Function to update delivery status
  const updateDeliveryStatus = (id, newStatus) => {
    if (window.confirm(`배송 상태를 ${getStatusLabel(newStatus)}(으)로 변경하시겠습니까?`)) {
      setDeliveries(deliveries.map(delivery => 
        delivery.id === id 
          ? { 
              ...delivery, 
              status: newStatus,
              deliveryDate: newStatus === "DELIVERED" ? new Date().toISOString().split('T')[0] : delivery.deliveryDate 
            } 
          : delivery
      ));
      alert("배송 상태가 업데이트되었습니다.");
    }
  };

  // Function to update tracking number
  const updateTrackingNumber = (id) => {
    const delivery = deliveries.find(d => d.id === id);
    const trackingNumber = prompt("운송장 번호를 입력하세요:", delivery.trackingNumber || "");
    
    if (trackingNumber !== null) {
      setDeliveries(deliveries.map(delivery => 
        delivery.id === id 
          ? { ...delivery, trackingNumber, status: trackingNumber ? "SHIPPING" : delivery.status } 
          : delivery
      ));
      if (trackingNumber) {
        alert("운송장 번호가 업데이트되었습니다.");
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
  };

  // Helper function to get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case "PENDING": return "배송 준비중";
      case "SHIPPING": return "배송중";
      case "DELIVERED": return "배송 완료";
      default: return status;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "PENDING":
        return <span className="status-badge pending">배송 준비중</span>;
      case "SHIPPING":
        return <span className="status-badge shipping">배송중</span>;
      case "DELIVERED":
        return <span className="status-badge delivered">배송 완료</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = deliveries.filter(delivery => 
    (delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "ALL" || delivery.status === statusFilter)
  );

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>배송 관리</h1>
        <div className="header-underline"></div>
      </div>
      
      <div className="delivery-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="주문번호, 고객명 또는 주소로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-container">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">전체 상태</option>
            <option value="PENDING">배송 준비중</option>
            <option value="SHIPPING">배송중</option>
            <option value="DELIVERED">배송 완료</option>
          </select>
        </div>
      </div>
      
      <div className="delivery-stats">
        <div className="stat-item">
          <span className="stat-label">전체 배송</span>
          <span className="stat-value all">{deliveries.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">배송 준비중</span>
          <span className="stat-value pending">{deliveries.filter(d => d.status === "PENDING").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">배송중</span>
          <span className="stat-value shipping">{deliveries.filter(d => d.status === "SHIPPING").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">배송 완료</span>
          <span className="stat-value delivered">{deliveries.filter(d => d.status === "DELIVERED").length}</span>
        </div>
      </div>
      
      <div className="table-container">
        <table className="delivery-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>고객명</th>
              <th>주소</th>
              <th>주문 제품</th>
              <th>주문일</th>
              <th>운송장 번호</th>
              <th>배송 상태</th>
              <th>배송일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>{delivery.orderNumber}</td>
                  <td>{delivery.customerName}</td>
                  <td className="address-cell">{delivery.address}</td>
                  <td className="items-cell">{delivery.items}</td>
                  <td>{formatDate(delivery.orderDate)}</td>
                  <td>
                    {delivery.trackingNumber || "-"}
                    <button 
                      className="tracking-button"
                      onClick={() => updateTrackingNumber(delivery.id)}
                    >
                      📝
                    </button>
                  </td>
                  <td>{getStatusBadge(delivery.status)}</td>
                  <td>{formatDate(delivery.deliveryDate)}</td>
                  <td>
                    <div className="action-buttons">
                      {delivery.status !== "DELIVERED" && (
                        <button 
                          className="next-status-button"
                          onClick={() => updateDeliveryStatus(
                            delivery.id, 
                            delivery.status === "PENDING" ? "SHIPPING" : "DELIVERED"
                          )}
                        >
                          {delivery.status === "PENDING" ? "배송 시작" : "배송 완료"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="9">검색 결과가 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Delivery; 