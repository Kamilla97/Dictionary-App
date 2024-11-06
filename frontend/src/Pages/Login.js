import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // Import AuthContext
import { jwtDecode } from 'jwt-decode';
const config = require('./../config');
const apiUrl = config.API_URL;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // Get login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);  // Store the access token
      localStorage.setItem('refreshToken', data.refreshToken);  // Store the refresh token

      login(data.accessToken);  // Call the login function to update context
      const decodedToken = jwtDecode(data.accessToken)
      if(decodedToken.role=="admin")
        navigate('/admin');  // Redirect to admin panel after successful login
      else if(decodedToken.role=="contributor")
        navigate('/contributor-panel');  // Redirect to admin panel after successful login
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
