
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./signUpheader.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons



import { useNavigate } from "react-router-dom";

function LoginRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); 

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'password') setPassword(value);
    };


    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/CodeFusionUI/SignUpServlet", {
                name,
                email,
                password
            }, { headers: { "Content-Type": "application/json" } });

            alert(response.data.message);
        } catch (error) {
            alert("Signup Failed: " + error.response?.data?.error || "Server Error");
        }
    };

    
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/CodeFusionUI/LogInServ", 
            { email, password }, 
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true 
            });
    
            if (response.status === 200) {
                alert("Login successful!");
                document.cookie = `SessionID=${response.data.sessionId}`;
                document.cookie = `userID=${response.data.userId}`;
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            alert("Login Failed: " + (error.response?.data?.error || "Server Error"));
        }
    };
    useEffect(() => {
        const body = document.body;
        const createHalfCircle = () => {
            let halfCircle = document.createElement("div");
            halfCircle.className = "half-circle";
            body.appendChild(halfCircle);

            setTimeout(() => {
                halfCircle.remove();
            }, 6000);
        };

        const interval = setInterval(createHalfCircle, 8000);

        return () => clearInterval(interval);
    }, []);



    return (
        <div className="body-container">
            <div className={`login-container ${isActive ? "active" : ""}`}>
                {/* SIGN UP FORM */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1 className="logh1Font">Create Account</h1>
                        <input className="logInp" type="text" name="name" placeholder="Name" value={name} onChange={handleInputChange} required />
                        <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
                        {/* <input className="logInp" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required /> */}


                        <div className="password-container">
                            <input
                                className="logInp paddingStyle"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={handleInputChange}
                                required
                            />
                            <span onClick={togglePassword} className="eye-icon">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button className="logBtn" type="submit">Register</button>
                    </form>
                </div>

                {/* LOGIN FORM */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1 className="logh1Font">Sign In</h1>
                        <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />

                        <div className="password-container">
                            <input className="logInp paddingStyle"
                             type ={showPassword ? "text" : "password"} 
                             name="password" 
                             placeholder="Password"
                              value={password}
                              onChange={handleInputChange}
                              required
                              />
                              <span onClick={togglePassword} className="eye-icon">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </span>
                        </div>

                        {/* <input className="logInp paddingStyle" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required /> */}
                        <div className="options">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgotPassword"); }}>
                                Forgot Password?
                            </a>

                        </div>
                        <button className="logBtn" type="submit">Log In</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay-content">
                        <h1 className="styleh1">{isActive ? "Welcome!" : "Welcome Again!"}</h1>
                        <p>{isActive ? "Sign up and explore with us." : "Log in to continue your journey."}</p>
                        <button className="logBtn ghost" onClick={() => setIsActive(!isActive)}>
                            {isActive ? "Log In" : "Register"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginRegister;