
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
function LoginRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    // Handle input change
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


        // 🔹 LOGIN FUNCTION (Connects to Java Servlet)
        const handleLogin = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post("http://localhost:8080/CodeFusionUI/LogInServ", {
                    email,
                    password
                }, { headers: { "Content-Type": "application/json" },
                withCredentials: true
             });
    
                if (response.status === 200) {
                    alert("Login successful!");
                    document.cookie = `SessionID=${response.data.sessionId}`;
                    document.cookie = `userID=${response.data.userId}`;
                    // navigate("/codeEditor");

                } else {
                    alert("Invalid credentials");
                }
            } catch (error) {
                alert("Login Failed: " + error.response?.data?.error || "Server Error");
            }
        }
  

    useEffect(() => {
        const body = document.body;

        const createHalfCircle = () => {
            let halfCircle = document.createElement("div");
            halfCircle.className = "half-circle";
            body.appendChild(halfCircle);

            // Remove the element after animation completes
            setTimeout(() => {
                halfCircle.remove();
            }, 6000);
        };

        // Run the effect every 8 seconds
        const interval = setInterval(createHalfCircle, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="body-container">
        <div className={`container ${isActive ? "active" : ""}`}>
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
            <form onSubmit={handleSignUp}>
                <h1>Create Account</h1>
                <input type="text" name="name" placeholder="Name" value={name} onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
                <input type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
                <button type="submit">Register</button>
            </form>
        </div>

        {/* LOGIN FORM */}
        <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
                <h1>Sign In</h1>
                <input type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
                <input type="password" className="paddingStyle" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
                <div className="options">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgotPassword"); }}>
                        Forgot Password?
                    </a>

                </div>
                <button type="submit">Log In</button>
            </form>
        </div>

        {/* SLIDING PANEL */}
        <div className="overlay-container">
            <div className="overlay-content">
                <h1 className="styleh1">{isActive ? "Welcome!" : "Welcome Again!"}</h1>
                <p>{isActive ? "Sign up and explore with us." : "Log in to continue your journey."}</p>
                <button className="ghost" onClick={() => setIsActive(!isActive)}>
                    {isActive ? "Log In" : "Register"}
                </button>
            </div>
        </div>
    </div>
    </div>
    );
}

export default LoginRegister;