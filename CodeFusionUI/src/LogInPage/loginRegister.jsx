
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./signUpheader.css";

// import { useNavigate } from "react-router-dom";

// function LoginRegister() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isActive, setIsActive] = useState(false);
//     const navigate = useNavigate();


//     useEffect(() => {
//         const body = document.body;

//         const createHalfCircle = () => {
//             let halfCircle = document.createElement("div");
//             halfCircle.className = "half-circle";
//             body.appendChild(halfCircle);

//             setTimeout(() => {
//                 halfCircle.remove();
//             }, 6000);
//         };

//         const interval = setInterval(createHalfCircle, 8000);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="body-container">
//             <div className={`login-container ${isActive ? "active" : ""}`}>
//                 {/* SIGN UP FORM */}
//                 <div className="form-container sign-up-container">
//                     <form className="signForm" onSubmit={handleSignUp}>
//                         <h1 className="logh1Font">Create Account</h1>
//                         <input className="logInp" type="text" name="name" placeholder="Name" value={name} onChange={handleInputChange} required />
//                         <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
//                         <input className="logInp" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
//                         <button className="logBtn" type="submit">Register</button>
//                     </form>
//                 </div>

//                 {/* LOGIN FORM */}
//                 <div className="form-container sign-in-container">
//                     <form className="signForm" onSubmit={handleLogin}>
//                         <h1 className="logh1Font">Sign In</h1>
//                         <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
//                         <input className="logInp paddingStyle" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
//                         <div className="options">
//                             <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgotPassword"); }}>
//                                 Forgot Password?
//                             </a>

//                         </div>
//                         <button className="logBtn" type="submit">Log In</button>
//                     </form>
//                 </div>

//                 <div className="overlay-container">
//                     <div className="overlay-content">
//                         <h1 className="styleh1">{isActive ? "Welcome!" : "Welcome Again!"}</h1>
//                         <p>{isActive ? "Sign up and explore with us." : "Log in to continue your journey."}</p>
//                         <button className="logBtn ghost" onClick={() => setIsActive(!isActive)}>
//                             {isActive ? "Log In" : "Register"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LoginRegister;






import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./signUpheader.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import GoogleAuth from "../Auth/GoogleAuth";
import { UserContext } from "./UserProvider";
import { capitalize } from "../utils/Utilies";
import { usePopup } from "../PopupIndication/PopUpContext";
import ZohoAuth from "../Auth/Zoho";

function LoginRegister() {
    const { setUserLoginCredentials } = useContext(UserContext);
    const { showPopup } = usePopup();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'password') setPassword(value);
    };


    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/signup`, {
                username: name,
                email: email,
                password: password
            });
            console.log(response);

            if (response.status === 201) {
                setUserLoginCredentials(response.data)
                localStorage.setItem('token', response.data.token);
                // localStorage.setItem('username', response.data.username);
                // localStorage.setItem('email', response.data.email);
                // localStorage.setItem('name', capitalize(response.data.name));
                navigate("/Dashboard");

            }

        } catch (error) {
            console.log("Signup Failed: " + error.response?.data?.error || "Server Error");
        }
    };


    const handleLogin = async (event) => {
        event.preventDefault();
        console.log(import.meta.env.VITE_SERVLET_URL);

        try {
            // const response = await axios.post("http://localhost:8080/CodeFusion_war/login", {
            //     username: "",
            //     email,
            //     password
            // });
            const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/login`, {
                username: "",
                email,
                password
            });
            console.log(response);

            if (response.status === 200) {
                showPopup("Login Success", 'success', 10000);
                console.log(response.data);
                console.log(response.data.token);
                setUserLoginCredentials(response.data)
                localStorage.setItem('token', response.data.token);
                // localStorage.setItem('username', response.data.username);
                // localStorage.setItem('email', response.data.email);
                // localStorage.setItem('name', capitalize(response.data.name));
                // localStorage.setItem('profilePic', response.data.profilePic);
                navigate("/Dashboard");

            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data)
            // alert("Login Failed: " + error.response?.data?.error || "Server Error");
        }
    }


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

        const handleErrorRemove = () => {
            setError(null);
        }

        window.addEventListener("click", handleErrorRemove);

        const interval = setInterval(createHalfCircle, 8000);
        return () => { clearInterval(interval); window.removeEventListener("click", handleErrorRemove); }
    }, []);

    // const handleGitHubLogin = () => {
    //     window.location.href = 'http://localhost:8080/CodeFusionUI/auth/github';
    // };

    // useEffect(() => {
    //     if (localStorage.getItem('token')) {
    //         navigate("/IDE");
    //     }
    // }, [token])

    return (
        <div className="body-container">
            <div className={`login-container ${isActive ? "active" : ""}`}>

                <div className="form-container sign-up-container">
                    <form className="signForm" onSubmit={handleSignUp}>
                        <h1 className="logh1Font">Create Account</h1>
                        <input className="logInp" type="text" name="name" placeholder="Name" value={name} onChange={handleInputChange} required />
                        <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
                        <input className="logInp" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
                        {error && (
                            <motion.div
                                initial={false}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="flex items-center justify-start"
                            >
                                <p className="pt-5 text-red-500">{error || 'Email Exists'}</p>
                            </motion.div>
                        )}
                        <button className="logBtn" type="submit">Register</button>
                        <div className="social-container">
                            <p className="social-title">Or sign up with</p>
                            <div className="social-buttons">
                                <GoogleAuth />
                                <ZohoAuth />

                                {/* <button type="button" className="social-button github-btn" onClick={handleGitHubLogin}>
                                    <FaGithub />
                                </button> */}
                            </div>
                        </div>
                    </form>
                </div>


                <div className="form-container sign-in-container">
                    <form className="signForm" onSubmit={handleLogin}>
                        <h1 className="logh1Font">Sign In</h1>
                        <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
                        <input className="logInp paddingStyle" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
                        <div className="options">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgotPassword"); }}>
                                Forgot Password?
                            </a>
                        </div>
                        {error && (
                            <motion.div
                                initial={false}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="flex items-center justify-start"
                            >
                                <p className="pt-5 text-red-500">{error || 'Email Exists'}</p>
                            </motion.div>
                        )}
                        <button className="logBtn" type="submit">Log In</button>

                        <div className="social-container">
                            <p className="social-title">Or log in with</p>
                            <div className="social-buttons">
                                <GoogleAuth />
                                <ZohoAuth />
                                {/* <button type="button" className="social-button github-btn" onClick={handleGitHubLogin}>
                                    <FaGithub />
                                </button> */}
                            </div>
                        </div>
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