import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCredentials, setAuthenticated, isAuthenticated, isGloballyLocked, updatePassword } from "../utils/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [globalLockout, setGlobalLockout] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [updateResult, setUpdateResult] = useState(null);
  
  useEffect(() => {
    // Check if already authenticated
    if (isAuthenticated()) {
      navigate("/posts", { replace: true });
      return;
    }
    
    // Check if site is globally locked
    const lockStatus = isGloballyLocked();
    if (lockStatus.locked) {
      handleGlobalLockout(lockStatus.remainingTime);
    }
    
    return () => {
      // Clean up interval on component unmount
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [navigate]);

  const handleGlobalLockout = (seconds) => {
    setGlobalLockout(true);
    setRemainingTime(seconds);
    
    // Clear any existing interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    // Set up countdown timer
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGlobalLockout(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle secret password changer
  const handleAdminKeySequence = (e) => {
    // Handle both Mac (cmd+alt+p) and Windows/Linux (ctrl+alt+p)
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? e.metaKey : e.ctrlKey;
    
    if (modifierKey && e.altKey && e.key === 'p') {
      setPasswordChangeMode(!passwordChangeMode);
      setUpdateResult(null);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setUpdateResult({
        success: false,
        message: "새 비밀번호를 입력해주세요."
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await updatePassword(newPassword);
      setUpdateResult(result);
      
      if (result.success) {
        // Clear the form if successful
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setUpdateResult({
        success: false,
        message: "비밀번호 변경 중 오류가 발생했습니다."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Validate inputs
    if (!username.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    
    // Check if site is globally locked
    const lockStatus = isGloballyLocked();
    if (lockStatus.locked) {
      handleGlobalLockout(lockStatus.remainingTime);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Attempt login with our secure verification function
      const result = await verifyCredentials(username, password);
      
      if (result.success) {
        // Set authenticated state and redirect
        setAuthenticated(true);
        navigate("/posts", { replace: true });
      } else if (result.globalLock) {
        // Handle global lockout
        handleGlobalLockout(result.remainingTime);
      } else {
        // Handle failed login
        setError(`아이디 또는 비밀번호가 틀렸습니다. (${result.attempts}/${result.maxAttempts})`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" tabIndex="0" onKeyDown={handleAdminKeySequence}>
      <div className="login-card">
        <div className="login-header">
          <h1>Crafteria Admin</h1>
          <p>관리자 로그인</p>
        </div>
        
        {passwordChangeMode ? (
          <div className="password-change-container">
            <h2>관리자 비밀번호 변경</h2>
            <form className="login-form" onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="newPassword">새 비밀번호</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  disabled={isLoading}
                />
              </div>
              
              {updateResult && (
                <div className={`message-box ${updateResult.success ? 'success' : 'error'}`}>
                  {updateResult.message}
                </div>
              )}
              
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "비밀번호 변경"}
              </button>
              
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setPasswordChangeMode(false);
                  setNewPassword("");
                  setUpdateResult(null);
                }}
                disabled={isLoading}
              >
                취소
              </button>
            </form>
            
            <div className="password-help">
              <p>비밀번호 변경 과정:</p>
              <ol>
                <li>새 비밀번호를 입력합니다.</li>
                <li>변경을 실행하려면 <code>src/utils/auth.js</code> 파일에서 <code>ADMIN_PASSWORD</code> 상수를 수정하세요.</li>
              </ol>
            </div>
          </div>
        ) : globalLockout ? (
          <div className="lockout-message">
            <div className="lockout-icon">🔒</div>
            <h2>접근 제한</h2>
            <p>로그인 시도가 너무 많습니다.</p>
            <p>남은 시간: <span className="countdown">{formatTime(remainingTime)}</span></p>
            <p className="lockout-info">5분 후에 다시 시도해주세요.</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        )}
        
        <div className="login-footer">
          <p>© 2025 Crafteria. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
