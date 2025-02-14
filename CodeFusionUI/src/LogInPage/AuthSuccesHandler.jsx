import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthSuccessHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('sessionId');
    const userId = params.get('userId');

    if (sessionId && userId) {
      document.cookie = `SessionID=${sessionId}`;
      document.cookie = `userID=${userId}`;
      alert("Social login successful!");
      navigate("/codeEditor");
    } else {
      alert("Authentication failed");
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Processing authentication...</h2>
    </div>
  );
}

export default AuthSuccessHandler;