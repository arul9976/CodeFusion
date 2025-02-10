import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validation from "./validation"; 
import "./LogIn.css"; 
import axios from "axios";

function LogIn() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({}); 

  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        return;
    }

    try {
        const res = await axios.post("http://localhost:8080/login", values);
        if (res.data.message === "Login Successful!") {
            navigate('/editor');
        } else {
            setErrors({ general: "Invalid email or password. Please try again." });
        }
    } catch (err) {
        setErrors({ general: "Server Error. Try again later." });
    }
};

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      
      {errors.general && <p className="error-message">{errors.general}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Enter Email" 
            name="email"
            value={values.email}
            onChange={handleInput}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter Password"
            name="password"
            value={values.password}
            onChange={handleInput}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <button type="submit">Log In</button>
        <p>By logging in, you agree to our terms and policies.</p>
        <button type="button"className="create-account-btn" onClick={() => navigate("/signup")}>Create Account</button>
      </form>
    </div>
  );
}

export default LogIn;