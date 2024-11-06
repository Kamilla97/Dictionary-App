// utils/refreshToken.js
const config = require('./../config');
const apiUrl = config.API_URL;

export const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch('http://localhost:3000/api/refresh-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      console.log(data)
      localStorage.setItem('token', data.accessToken); // Update the token
      // localStorage.setItem('refreshToken', data.refreshToken); // Update the refresh token
  
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Handle token refresh failure (e.g., log out the user)
    }
  };
  