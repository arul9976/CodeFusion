import React from 'react'
import { useNavigate } from 'react-router-dom'

const BacktoLogin = () => {
  const navigate = useNavigate();
  return (
    <button className="back-btn" onClick={() => navigate("/loginRegister")}>
      Back to Login
    </button>
  )
}

export default BacktoLogin