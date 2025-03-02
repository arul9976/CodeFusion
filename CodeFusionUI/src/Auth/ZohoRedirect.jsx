
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../LogInPage/UserProvider';
import { capitalize } from '../utils/Utilies';
import { useNavigate } from 'react-router-dom';
import ZAuth from './ZAuth';
import './ZAuth.css';
const ZohoRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { setUserLoginCredentials } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log("Code: " + code);

    const fetchZohoAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVLET_URL}/oauth/zoho?code=${encodeURIComponent(code)}`);
        if (response.status === 200) {
          console.log(response);

          const success = setUserLoginCredentials(response.data);
          console.log(success);

          if (success) {
            localStorage.setItem('token', response.data.token);
            // localStorage.setItem('username', response.data.username);
            // localStorage.setItem('email', response.data.email);
            // localStorage.setItem('name', capitalize(response.data.name));
            setIsAuthenticated(true)
            setTimeout(() => navigate("/Dashboard"), 1000);
          }

        }
      } catch (e) {
        console.log(e.message);

      }
    }
    fetchZohoAuth();
  })
  return (
    <>
      <ZAuth isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
    </>
  )
}

export default ZohoRedirect