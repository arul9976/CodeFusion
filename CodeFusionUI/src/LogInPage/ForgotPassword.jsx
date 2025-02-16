import React, { useState } from "react";
import axios from "axios";
import "./signUpheader.css";

import { useNavigate } from "react-router-dom";
import BacktoLogin from "./BacktoLogin";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     try {
    //         const response = await axios.post("http://localhost:8080/CodeFusionUI/ForgotPasswordServ", { email });
    //         setMessage(response.data.message);
    //     } catch (error) {
    //         setMessage("Error: " + (error.response?.data?.error || "Server Error"));
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/CodeFusionUI/ForgotPasswordServ",
                new URLSearchParams({ email }).toString(),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            setMessage(response.data.message);
            navigate("/resetPassword"); 
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || "Server Error"));
        }
    };
    return (
        <div className="body-container">
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <h2>Forgot Password</h2>
                    <p>Enter your email, and we'll send you a password reset link.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            className="stylePlaceHolder"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    <button className="logBtn" type="submit">Send Reset Link</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                    <button className="back-btn" onClick={() => navigate("/loginRegister")}>
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;



