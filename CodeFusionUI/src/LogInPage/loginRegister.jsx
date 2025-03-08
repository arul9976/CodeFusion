// // import React, { useState, useEffect, useContext } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { motion, AnimatePresence } from "framer-motion";?
// // import axios from "axios";
// // import { UserContext } from "./UserProvider";
// // import { usePopup } from "../PopupIndication/PopUpContext";
// // import GoogleAuth from "../Auth/GoogleAuth";
// // import ZohoAuth from "../Auth/Zoho";

// // const LoginRegister = () => {
// //     const { setUserLoginCredentials } = useContext(UserContext);
// //     const { showPopup } = usePopup();
// //     const navigate = useNavigate();

// //     const [formData, setFormData] = useState({
// //         name: "",
// //         email: "",
// //         password: ""
// //     });
// //     const [isLoginView, setIsLoginView] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [isLoading, setIsLoading] = useState(false);

// //     const containerVariants = {
// //         hidden: { opacity: 0 },
// //         visible: {
// //             opacity: 1,
// //             transition: { duration: 0.5 }
// //         },
// //         exit: {
// //             opacity: 0,
// //             transition: { duration: 0.3 }
// //         }
// //     };

// //     const formVariants = {
// //         hidden: { opacity: 0, y: 20 },
// //         visible: {
// //             opacity: 1,
// //             y: 0,
// //             transition: { duration: 0.4, delay: 0.2 }
// //         }
// //     };

// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //         if (error) setError(null);
// //     };

// //     const handleSignUp = async (e) => {
// //         e.preventDefault();
// //         setIsLoading(true);

// //         try {
// //             const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/signup`, {
// //                 username: formData.name,
// //                 email: formData.email,
// //                 password: formData.password
// //             });

// //             if (response.status === 201) {
// //                 showPopup("Account created successfully!", 'success', 5000);
// //                 setUserLoginCredentials(response.data);
// //                 localStorage.setItem('token', response.data.token);
// //                 navigate("/Dashboard");
// //             }
// //         } catch (error) {
// //             setError(error.response?.data?.error || "Failed to create account");
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const handleLogin = async (e) => {
// //         e.preventDefault();
// //         setIsLoading(true);

// //         try {
// //             const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/login`, {
// //                 username: "",
// //                 email: formData.email,
// //                 password: formData.password
// //             });

// //             if (response.status === 200) {
// //                 showPopup("Login successfully!", 'success', 5000);
// //                 setUserLoginCredentials(response.data);
// //                 localStorage.setItem('token', response.data.token);
// //                 navigate("/Dashboard");
// //             }
// //         } catch (error) {
// //             setError(error.response?.data || "Invalid email or password");
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         const createBackgroundEffect = () => {
// //             const container = document.querySelector('.background-animation');
// //             if (!container) return;

// //             const particle = document.createElement('div');
// //             particle.className = 'particle';

// //             const size = Math.random() * 15 + 5;
// //             particle.style.width = `${size}px`;
// //             particle.style.height = `${size}px`;
// //             particle.style.left = `${Math.random() * 100}%`;
// //             particle.style.animationDuration = `${Math.random() * 10 + 5}s`;

// //             container.appendChild(particle);

// //             setTimeout(() => {
// //                 particle.remove();
// //             }, 15000);
// //         };

// //         const interval = setInterval(createBackgroundEffect, 300);
// //         return () => clearInterval(interval);
// //     }, []);

// //     return (
// //         <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[rgba(37, 48, 68, 0.7)] to-blue-900 text-white">
// //             <div className="background-animation absolute inset-0 overflow-hidden z-0"></div>

// //             <motion.div
// //                 className="relative z-10 w-full max-w-4xl bg-slate-800/40 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
// //                 initial="hidden"
// //                 animate="visible"
// //                 variants={containerVariants}
// //             >
// //                 <div className="flex flex-col md:flex-row h-full">
// //                     <motion.div
// //                         className="w-full md:w-5/12 bg-gradient-to-br from-[rgba(37, 48, 68, 0.7)] to-[#4a90e2] p-8 flex flex-col justify-center items-center text-center"
// //                         initial={{ x: -50, opacity: 0 }}
// //                         animate={{ x: 0, opacity: 1 }}
// //                         transition={{ duration: 0.5 }}
// //                     >
// //                         <div className="mb-8">
// //                             <motion.div
// //                                 className="text-5xl font-bold mb-6"
// //                                 initial={{ y: -20, opacity: 0 }}
// //                                 animate={{ y: 0, opacity: 1 }}
// //                                 transition={{ delay: 0.3, duration: 0.5 }}
// //                             >
// //                                 CodeFusion
// //                             </motion.div>

// //                             <motion.h2
// //                                 className="text-2xl font-medium mb-4"
// //                                 initial={{ y: -20, opacity: 0 }}
// //                                 animate={{ y: 0, opacity: 1 }}
// //                                 transition={{ delay: 0.4, duration: 0.5 }}
// //                             >
// //                                 {isLoginView ? "Welcome Back!" : "Join Our Community"}
// //                             </motion.h2>

// //                             <motion.p
// //                                 className="text-blue-100 mb-8"
// //                                 initial={{ y: -20, opacity: 0 }}
// //                                 animate={{ y: 0, opacity: 1 }}
// //                                 transition={{ delay: 0.5, duration: 0.5 }}
// //                             >
// // {isLoginView
// //     ? "Continue your coding journey with your teammates"
// //     : "Create, collaborate, and build amazing projects together"}
// //                             </motion.p>
// //                         </div>


// //                     </motion.div>

// //                     <div className="w-full md:w-7/12 p-8 flex items-center justify-center">
// //                         <AnimatePresence mode="wait">
// //                             <motion.div
// //                                 key={isLoginView ? "login" : "register"}
// //                                 className="w-full max-w-md"
// //                                 variants={formVariants}
// //                                 initial="hidden"
// //                                 animate="visible"
// //                                 exit="hidden"
// //                             >
// //                                 <h1 className="text-3xl font-bold mb-6 text-center">
// //                                     {isLoginView ? "Sign In" : "Create Account"}
// //                                 </h1>

// //                                 <form onSubmit={isLoginView ? handleLogin : handleSignUp}>
// //                                     {!isLoginView && (
// //                                         <div className="mb-4">
// //                                             <label className="block text-sm font-medium mb-1">Name</label>
// //                                             <input
// //                                                 type="text"
// //                                                 name="name"
// //                                                 value={formData.name}
// //                                                 onChange={handleInputChange}
// //                                                 className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
// //                                                 placeholder="Your name"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                     )}

// //                                     <div className="mb-4">
// //                                         <label className="block text-sm font-medium mb-1">Email</label>
// //                                         <input
// //                                             type="email"
// //                                             name="email"
// //                                             value={formData.email}
// //                                             onChange={handleInputChange}
// //                                             className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
// //                                             placeholder="Your email"
// //                                             required
// //                                         />
// //                                     </div>

// //                                     <div className="mb-6">
// //                                         <label className="block text-sm font-medium mb-1">Password</label>
// //                                         <input
// //                                             type="password"
// //                                             name="password"
// //                                             value={formData.password}
// //                                             onChange={handleInputChange}
// //                                             className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
// //                                             placeholder="Your password"
// //                                             required
// //                                         />
// //                                     </div>

// //                                     {isLoginView && (
// //                                         <div className="flex justify-end mb-4">
// //                                             <a
// //                                                 href="#"
// //                                                 className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
// //                                                 onClick={(e) => {
// //                                                     e.preventDefault();
// //                                                     navigate("/forgotPassword");
// //                                                 }}
// //                                             >
// //                                                 Forgot Password?
// //                                             </a>
// //                                         </div>
// //                                     )}

// // {error && (
// //     <motion.div
// //         initial={{ opacity: 0, y: -10 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
// //     >
// //         {error}
// //     </motion.div>
// // )}

// //                                     <motion.button
// //                                         type="submit"
// //                                         className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-[#4a90e2] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
// //                                         whileHover={{ scale: 1.02 }}
// //                                         whileTap={{ scale: 0.98 }}
// //                                         disabled={isLoading}
// //                                     >
// //                                         {isLoading ? (
// //                                             <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
// //                                         ) : null}
// //                                         {isLoginView ? "Sign In" : "Create Account"}
// //                                     </motion.button>


// //                                 </form>
// //                                 <div className="w-full flex iterm-center justify-center my-3">
// //                                     <motion.button
// //                                         className="bg-transparent m-auto hover:bg-white/10 text-white border border-white rounded-lg px-8 py-2 transition-all duration-300"
// //                                         whileHover={{ scale: 1.05 }}
// //                                         whileTap={{ scale: 0.95 }}
// //                                         onClick={() => setIsLoginView(!isLoginView)}
// //                                     >
// //                                         {isLoginView ? "Create Account" : "Sign In"}
// //                                     </motion.button>
// //                                 </div>


// //                                 <div className="mt-8">
// //                                     <div className="relative mb-4">
// //                                         <div className="absolute inset-0 flex items-center">
// //                                             <div className="w-full border-t border-gray-600"></div>
// //                                         </div>
// //                                         <div className="relative flex justify-center">
// //                                             <span className="px-3 bg-slate-800/40 text-sm text-gray-400">Or continue with</span>
// //                                         </div>
// //                                     </div>

// //                                     <div className="flex space-x-3 justify-center">
// //                                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //                                             <GoogleAuth />
// //                                         </motion.div>
// //                                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //                                             <ZohoAuth />
// //                                         </motion.div>
// //                                     </div>
// //                                 </div>
// //                             </motion.div>
// //                         </AnimatePresence>
// //                     </div>
// //                 </div>
// //             </motion.div>
// //         </div>
// //     );
// // };

// // export default LoginRegister;





// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import "./signUpheader.css";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// import GoogleAuth from "../Auth/GoogleAuth";
// import { UserContext } from "./UserProvider";
// import { usePopup } from "../PopupIndication/PopUpContext";
// import ZohoAuth from "../Auth/Zoho";

// function LoginRegister() {
//     const { setUserLoginCredentials } = useContext(UserContext);
//     const { showPopup } = usePopup();

//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isActive, setIsActive] = useState(false);
//     const navigate = useNavigate();
//     const [error, setError] = useState(null);

//     const handleInputChange = (event) => {
//         const { name, value } = event.target;
//         if (name === 'name') setName(value);
//         else if (name === 'email') setEmail(value);
//         else if (name === 'password') setPassword(value);
//     };


//     const handleSignUp = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/signup`, {
//                 username: name,
//                 email: email,
//                 password: password
//             });
//             console.log(response);

//             if (response.status === 201) {
//                 showPopup("SignUp Successfully", 'success', 10000);
//                 setUserLoginCredentials(response.data)
//                 localStorage.setItem('token', response.data.token);
//                 // localStorage.setItem('username', response.data.username);
//                 // localStorage.setItem('email', response.data.email);
//                 // localStorage.setItem('name', capitalize(response.data.name));
//                 navigate("/Dashboard");

//             }

//         } catch (error) {
//             console.log("Signup Failed: " + error.response?.data?.error || "Server Error");
//         }
//     };


//     const handleLogin = async (event) => {
//         event.preventDefault();
//         console.log(import.meta.env.VITE_SERVLET_URL);

//         try {
//             const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/login`, {
//                 username: "",
//                 email,
//                 password
//             });
//             console.log(response);

//             if (response.status === 200) {
//                 showPopup("Login Successfully", 'success', 10000);
//                 console.log(response.data);
//                 console.log(response.data.token);
//                 setUserLoginCredentials(response.data)
//                 localStorage.setItem('token', response.data.token);
//                 // localStorage.setItem('username', response.data.username);
//                 // localStorage.setItem('email', response.data.email);
//                 // localStorage.setItem('name', capitalize(response.data.name));
//                 // localStorage.setItem('profilePic', response.data.profilePic);
//                 navigate("/Dashboard");

//             } else {
//                 alert("Invalid credentials");
//             }
//         } catch (error) {
//             console.log(error);
//             setError(error.response?.data)
//             // alert("Login Failed: " + error.response?.data?.error || "Server Error");
//         }
//     }


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

//         const handleErrorRemove = () => {
//             setError(null);
//         }

//         window.addEventListener("click", handleErrorRemove);

//         const interval = setInterval(createHalfCircle, 8000);
//         return () => { clearInterval(interval); window.removeEventListener("click", handleErrorRemove); }
//     }, []);

//     // const handleGitHubLogin = () => {
//     //     window.location.href = 'http://localhost:8080/CodeFusionUI/auth/github';
//     // };

//     // useEffect(() => {
//     //     if (localStorage.getItem('token')) {
//     //         navigate("/IDE");
//     //     }
//     // }, [token])

//     return (
//         <div className="body-container">
//             <div className={`login-container ${isActive ? "active" : ""}`}>

//                 <div className="form-container sign-up-container">
//                     <form className="signForm" onSubmit={handleSignUp}>
//                         <h1 className="logh1Font">Create Account</h1>
//                         <input className="logInp" type="text" name="name" placeholder="Name" value={name} onChange={handleInputChange} required />
//                         <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
//                         <input className="logInp" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
//                         {/* {error && (
//                             <motion.div
//                                 initial={false}
//                                 animate={{
//                                     opacity: 1,
//                                     scale: 1,
//                                 }}
//                                 transition={{ duration: 0.2, ease: "easeInOut" }}
//                                 className="flex items-center justify-start"
//                             >
//                                 <p className="pt-5 text-red-500">{error || 'Email Exists'}</p>
//                             </motion.div>
//                         )} */}

//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
//                             >
//                                 {error}
//                             </motion.div>
//                         )}
//                         <div className="flex justify-between">

//                             <button className="logBtn" type="submit">Register</button>
//                             <button className="logBtn ghost" onClick={() => setIsActive(!isActive)}>
//                                 {isActive ? "Login" : "Register"}
//                             </button>
//                         </div>
//                         <div className="social-container">
//                             <p className="social-title">Or sign up with</p>
//                             <div className="social-buttons">
//                                 <GoogleAuth />
//                                 <ZohoAuth />

//                                 {/* <button type="button" className="social-button github-btn" onClick={handleGitHubLogin}>
//                                     <FaGithub />
//                                 </button> */}
//                             </div>
//                         </div>
//                     </form>
//                 </div>


//                 <div className="form-container sign-in-container">
//                     <form className="signForm" onSubmit={handleLogin}>
//                         <h1 className="logh1Font">Sign in</h1>
//                         <input className="logInp" type="email" name="email" placeholder="Email" value={email} onChange={handleInputChange} required />
//                         <input className="logInp paddingStyle" type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} required />
//                         <div className="options">
//                             <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgotPassword"); }}>
//                                 Forgot Password?
//                             </a>
//                         </div>
//                         {/* {error && (
//                             <motion.div
//                                 initial={false}
//                                 animate={{
//                                     opacity: 1,
//                                     scale: 1,
//                                 }}
//                                 transition={{ duration: 0.2, ease: "easeInOut" }}
//                                 className="flex items-center justify-start"
//                             >
//                                 <p className="pt-5 text-red-500">{error || 'Email Exists'}</p>
//                             </motion.div>
//                         )} */}
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="mb-4 p-3 bg-red-500/20 border border-red-500/50 my-3 rounded-lg text-red-700 text-sm"
//                             >
//                                 {error}
//                             </motion.div>
//                         )}
//                         <div className="flex justify-between">
//                             <button className="logBtn" type="submit">Login</button>
//                             <button className="logBtn ghost" onClick={() => setIsActive(!isActive)}>
//                                 {isActive ? "Login" : "Register"}
//                             </button>
//                         </div>
//                         <div className="social-container">
//                             <p className="social-title">Or log in with</p>
//                             <div className="social-buttons">
//                                 <GoogleAuth />
//                                 <ZohoAuth />
//                                 {/* <button type="button" className="social-button github-btn" onClick={handleGitHubLogin}>
//                                     <FaGithub />
//                                 </button> */}
//                             </div>
//                         </div>
//                     </form>
//                 </div>

//                 <div className="overlay-container">

//                     <div className="overlay-content">
//                         <div>
//                             <h1 className="styleh1">{isActive ? "Welcome!" : "Welcome Again!"}</h1>

//                             {isActive
//                                 ? <p>Continue your coding journey with your teammates</p>
//                                 : <p>Create, collaborate, and build amazing projects together</p>}
//                         </div>
//                         <div className="w-full logo rounded-xl h-[100px] my-4 flex item-center justify-center">
//                             <img className="w-[100px]  p-3 rounded-full" src="/logo-wobg.png" alt="" />
//                             <div className={'logoText'}>Code Fusion</div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LoginRegister;


"use client"

import { useState, useContext, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import GoogleAuth from "../Auth/GoogleAuth"
import { UserContext } from "./UserProvider"
import { usePopup } from "../PopupIndication/PopUpContext"
import ZohoAuth from "../Auth/Zoho"

function LoginRegister() {
    const { setUserLoginCredentials } = useContext(UserContext)
    const { showPopup } = usePopup()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isActive, setIsActive] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    const handleInputChange = (event) => {
        const { name, value } = event.target
        if (name === "name") setName(value)
        else if (name === "email") setEmail(value)
        else if (name === "password") setPassword(value)
    }

    const handleSignUp = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/signup`, {
                username: name,
                email: email,
                password: password,
            })

            if (response.status === 201) {
                showPopup("SignUp Successfully", "success", 10000)
                setUserLoginCredentials(response.data)
                localStorage.setItem("token", response.data.token)
                navigate("/Dashboard")
            }
        } catch (error) {
            setError(error.response?.data?.error || "Signup Failed")
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVLET_URL}/login`, {
                username: "",
                email,
                password,
            })

            if (response.status === 200) {
                showPopup("Login Successfully", "success", 10000)
                setUserLoginCredentials(response.data)
                localStorage.setItem("token", response.data.token)
                navigate("/Dashboard")
            }
        } catch (error) {
            setError(error.response?.data || "Login Failed")
        }
    }

    // Enhanced animation variants with spring physics
    const formVariants = {
        login: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
                duration: 0.6,
            },
        },
        signup: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
                duration: 0.6,
            },
        },
        exitLogin: {
            x: -80,
            opacity: 0,
            scale: 0.9,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
            },
        },
        exitSignup: {
            x: 80,
            opacity: 0,
            scale: 0.9,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
            },
        },
        initial: {
            x: isActive ? -80 : 80,
            opacity: 0,
            scale: 0.9,
        },
    }

    const overlayVariants = {
        login: {
            backgroundColor: ["#1E293B", "#0F172A", "#1E293B"],
            scale: [1, 1.02, 1],
            transition: {
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96],
            },
        },
        signup: {
            backgroundColor: ["#0F172A", "#1E293B", "#0F172A"],
            scale: [1, 1.02, 1],
            transition: {
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96],
            },
        },
    }

    const textVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.7,
                delay: 0.2,
            },
        },
        exit: {
            y: -30,
            opacity: 0,
            transition: { duration: 0.4 },
        },
    }

    const inputVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (custom) => ({
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: 0.1 * custom,
                duration: 0.5,
            },
        }),
    }

    const buttonVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: 0.5,
                duration: 0.5,
            },
        },
        hover: {
            scale: 1.03,
            transition: { duration: 0.2 },
        },
        tap: {
            scale: 0.97,
            transition: { duration: 0.1 },
        },
    }

    const logoVariants = {
        hidden: { scale: 0.8, opacity: 0, rotate: -10 },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.5,
                duration: 0.8,
            },
        },
        hover: {
            rotate: 10,
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10,
            },
        },
    }

    useEffect(() => {

        const handleErrorRemove = () => {
            setError(null);
        }

        window.addEventListener("click", handleErrorRemove);

        // const interval = setInterval(createHalfCircle, 8000);
        return () => { window.removeEventListener("click", handleErrorRemove); }
    }, []);

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-8">
            <motion.div
                className="w-full max-w-4xl bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: [0.43, 0.13, 0.23, 0.96],
                    },
                }}
            >
                {/* Login/Signup Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={isActive ? "signup-title" : "login-title"}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={textVariants}
                            className="text-4xl font-bold text-white mb-8 text-center"
                        >
                            {isActive ? "Create Account" : "Sign In"}
                        </motion.h1>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isActive ? "signup-form" : "login-form"}
                            initial="initial"
                            animate={isActive ? "signup" : "login"}
                            exit={isActive ? "exitSignup" : "exitLogin"}
                            variants={formVariants}
                            onSubmit={isActive ? handleSignUp : handleLogin}
                            className="space-y-5"
                        >
                            {isActive && (
                                <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={1}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-3 bg-[#2C3345] border border-[#1E293B] text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </motion.div>
                            )}

                            <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={isActive ? 2 : 1}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-3 bg-[#2C3345] border border-[#1E293B] text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </motion.div>

                            <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={isActive ? 3 : 2}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-3 bg-[#2C3345] border border-[#1E293B] text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </motion.div>

                            {!isActive && (
                                <motion.div
                                    className="flex justify-end"
                                    variants={inputVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={3}
                                >
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            navigate("/forgotPassword")
                                        }}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Forgot Password?
                                    </a>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                        },
                                    }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg text-base"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.div className="flex space-x-4 pt-2" variants={buttonVariants} initial="hidden" animate="visible">
                                <motion.button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    {isActive ? "Register" : "Login"}
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={() => setIsActive(!isActive)}
                                    className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-600/10 transition-colors text-lg font-medium"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    {isActive ? "Switch to Login" : "Create Account"}
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    </AnimatePresence>

                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.7, duration: 0.5 },
                        }}
                    >
                        <div className="relative border-t border-gray-700 my-5">
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1E293B] px-4 text-gray-400 text-base">
                                Or continue with
                            </span>
                        </div>

                        <motion.div
                            className="flex justify-center space-x-5 mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.8, duration: 0.5 },
                            }}
                        >
                            <GoogleAuth />
                            <ZohoAuth />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Overlay Section */}
                <motion.div
                    className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1E293B] to-[#0F172A] items-center justify-center text-center relative overflow-hidden"
                    animate={isActive ? "signup" : "login"}
                    variants={overlayVariants}
                >
                    {/* Background animation elements */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-blue-500/10 top-0 right-0 -mr-32 -mt-32"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    />
                    <motion.div
                        className="absolute w-96 h-96 rounded-full bg-indigo-500/10 bottom-0 left-0 -ml-48 -mb-48"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 1,
                        }}
                    />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isActive ? "welcome-content" : "welcomeback-content"}
                            initial={{ opacity: 0, x: isActive ? -50 : 50, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.7,
                                },
                            }}
                            exit={{
                                opacity: 0,
                                x: isActive ? 50 : -50,
                                scale: 0.9,
                                transition: { duration: 0.5 },
                            }}
                            className="px-10 z-10"
                        >
                            <motion.h2
                                className="text-5xl font-bold text-white mb-6"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        delay: 0.3,
                                    },
                                }}
                            >
                                {isActive ? "Welcome!" : "Welcome Back!"}
                            </motion.h2>
                            <motion.p
                                className="text-gray-300 mb-10 text-lg"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        delay: 0.4,
                                    },
                                }}
                            >
                                {isActive
                                    ? "Create, collaborate, and build amazing projects together"
                                    : "Continue your coding journey with your teammates"}
                            </motion.p>

                            <motion.div
                                className="flex items-center justify-center mb-6"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { delay: 0.5, duration: 0.5 },
                                }}
                            >
                                <motion.img
                                    src="/logo-wobg.png"
                                    alt="Code Fusion Logo"
                                    className="w-28 h-28 rounded-full mr-5"
                                    variants={logoVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                />
                                <motion.span
                                    className="text-3xl font-bold text-white"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{
                                        x: 0,
                                        opacity: 1,
                                        transition: { delay: 0.6, duration: 0.5 },
                                    }}
                                >
                                    Code Fusion
                                </motion.span>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default LoginRegister

