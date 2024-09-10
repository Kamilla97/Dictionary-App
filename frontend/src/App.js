import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import AdminPanel from './Pages/AdminPanel';
import ContributorPanel from './Pages/ContributorPanel';
import Login from './Pages/Login';
import Register from './Pages/Register';
import PrivateRoute from './Components/PrivateRoute';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  const [searchResults, setSearchResults] = useState([]);  // State to store search results

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Pass setSearchResults to Navbar */}
          <Navbar setSearchResults={setSearchResults} />
          <Routes>
            <Route path="/" element={<Home searchResults={searchResults} />} /> 
            <Route path="/admin/*" element={
              <PrivateRoute requiredRole="admin">
                <AdminPanel />
              </PrivateRoute>
            } />
            <Route path="/contributor-panel/*" element={
              <PrivateRoute requiredRole="contributor">
                <ContributorPanel />
              </PrivateRoute>
            } />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
