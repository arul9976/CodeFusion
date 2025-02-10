import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validation from "./SignUpValidation";
import "./LogIn.css";
import axios from "axios";


function SignUp() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await axios.post("http://localhost:8080/signUp", values);
        navigate("/");
      } catch (err) {
        setErrors({ general: "Registration failed. Try again." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>

      {errors.general && <p className="error-message">{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            placeholder="Enter Name" 
            name="name"
            value={values.name}
            onChange={handleInput} 
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
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
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p className="redirect-text">Already have an account?</p>
      <button 
        type="button" 
        className="login-redirect-btn" 
        onClick={() => navigate("/")}
      >
        Log In
      </button>
    </div>
  );
}

export default SignUp;