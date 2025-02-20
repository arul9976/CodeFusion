import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {

  const navigate = useNavigate();
  const onSuccess = async (response) => {
    const { credential } = response;
    const token = credential;

    console.log("Google Token --> " + token);

    try {
      const response = await axios.post(`http://localhost:8080/CodeFusion_war/oauth/google`, { token: token });
      console.log(response);
      
      if (response.status === 201 || response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate("/IDE")
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        console.error('Error response from server:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something else went wrong during the request setup
        console.error('Error during request setup:', error.message);
      }
    }
  };

  const onFailure = (error) => {
    console.log("OAuth login failed:", error);
  };

  useEffect(() => {
    const rescheck = async () => {
      const res = await axios.post('http://localhost:8080/CodeFusion_war/', {}).then((res) => {
        console.log(res);
      }).catch((error) => {
        console.error(error);
      });


    }
    rescheck();
  })

  return (
    <GoogleOAuthProvider clientId="872496089913-tfpd35a3gk8mnac86t3ea46n0pcpk7ah.apps.googleusercontent.com">
      <div className="google-button-container">

        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
          type="icon"
          shape="circle"
        />
      </div>
    </GoogleOAuthProvider>

  );
};

export default GoogleAuth;
