import React, { useEffect } from 'react';

export default function Auth(params){
  async function GetGoogleAuthUrl() {
    try {
      const response = await fetch('http://localhost:8000/v1/google/url', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok){
        throw new Error(`Failed to get Google URL. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Redirect URL:', data.url);
      window.location.href = data.url;
    } catch (error){
      throw new Error(`Server is unavailable`);
    }
  };
  useEffect(() => {
    GetGoogleAuthUrl();
  }, []);
  return(
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redirecting to Google Authentication...</h2>
      <p>Please wait...</p>
    </div>
  );
}