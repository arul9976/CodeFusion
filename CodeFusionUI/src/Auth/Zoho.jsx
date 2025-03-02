import React, { useEffect } from 'react';
import axios from 'axios';

const ZohoAuth = () => {


  useEffect(() => {
    const rescheck = async () => {
      const res = await axios.post(import.meta.env.VITE_SERVLET_URL, {}).then((res) => {
        console.log(res.status);
      }).catch((error) => {
        console.error(error);
      });


    }
    rescheck();
  })

  const fetchToken = async () => {

    window.location.href = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=1000.YZIO79J63RMUBZCFWYHKHNB3VGE53E&scope=email&redirect_uri=${encodeURIComponent('http://localhost:3001/codefusion/zohoredirect')}`
    // onSuccess(response.data);
  }

  return (
    <>
      <div className="zoho-button-container">
        <button onClick={fetchToken} className='zAuth underline text-blue'>

        </button>
      </div>
    </>

  );
};

export default ZohoAuth;
