import React, { useEffect } from 'react';
import { API_URL, REACT_URL } from '../../config'

export default function Auth(params){
  async function GetGoogleAuthUrl() {
    try {
      const response = await fetch(API_URL + '/v1/google/url', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok){
        throw new Error(`Failed to get Google URL. Status: ${response.status}`);
      }
      const data = await response.json();
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