



import React, { useState } from "react";
import axios from "axios";
import "./signUpheader.css";

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/ResetPasswordServ", { email, otp, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || "Server Error"));
        }
    };

    return (
        <div className="body-container">
            <div className="reset-password-container">
                <div className="reset-password-card animate-fade-in">
                    <h2 className="styleH2">Reset Password</h2>
                    <p className="stylep">Enter your registered email and OTP.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            className="input-glowcolor"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            className="input-glowcolor"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            className="input-glowcolor"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            className="input-glowcolor"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button className="logBtn" type="submit">Reset Password</button>
                        {/* <BacktoLogin /> */}

                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;