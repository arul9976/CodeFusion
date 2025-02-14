import React from 'react'

const BacktoLogin = () => {
  return (
    <button className="back-btn" onClick={() => navigate("/loginRegister")}>
      Back to Login
    </button>
  )
}

export default BacktoLogin