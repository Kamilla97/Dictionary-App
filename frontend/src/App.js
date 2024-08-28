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

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* <Route path="/" element={<Home/>} />  */}
            {/* <Route path="/login/" element={<Login />} /> */}
            {/* <Route path="/register/" element={<Register />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
