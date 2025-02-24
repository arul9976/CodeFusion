import React, { useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../LogInPage/UserProvider';

const GoogleAuth = () => {

  const { setUserLoginCredentials } = useContext(UserContext);

  const navigate = useNavigate();
  const onSuccess = async (response) => {
    const { credential } = response;
    const token = credential;

    console.log("Google Token --> " + token);

    try {
      const response = await axios.post(`http://localhost:8080/CodeFusion_war/oauth/google`, { token: token });
      console.log(response);

      if (response.status === 201 || response.status === 200) {
        console.log("From Google Auth");
        const success = setUserLoginCredentials(response.data);
        console.log(success);

        if (success) {
          localStorage.setItem('token', response.data.token);
          // navigate("/IDE");
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
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
        console.log(res.status);
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
