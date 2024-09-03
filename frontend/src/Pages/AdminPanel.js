import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import { refreshToken } from '../utils/refreshToken';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume authenticated initially
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        const newToken = await refreshToken();
        if (!newToken) {
          setIsAuthenticated(false);
          navigate('/login');
        }
      }
    };

    checkToken();
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Optionally show a loading state or redirect to login
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <nav className="mb-4">
        <Link to="add-word" className="text-blue-500 hover:underline mr-4">Add New Word</Link>
        <Link to="words" className="text-blue-500 hover:underline mr-4">Manage Words</Link>
        <Link to="users" className="text-blue-500 hover:underline ">Manage Users</Link>
      </nav>
      <Routes>
        <Route path="add-word" element={<AddWord />} />
        <Route path="words" element={<WordsList />} />
        <Route path="users" element={<Users />} /> 
      </Routes>
    </div>
  );
}

export default AdminPanel;
