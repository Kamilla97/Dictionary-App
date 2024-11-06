import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from '../logo.svg';
import { FaMicrophone, FaStopCircle } from 'react-icons/fa';

const config = require('./../config');
const apiUrl = config.API_URL;

const Navbar = ({ setSearchResults }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  let recognition;
  if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Function to handle the search input change
  const handleSearch = async (query) => {
    if (query.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:3000/api/words/search?query=${query}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Failed to fetch search results', error);
      }
    } else {
      setSearchResults([]); // Clear search results if the query is empty
    }
  };

  // Function to handle typing in the search bar
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query); // Trigger the search when typing
  };

  const startRecording = () => {
    setIsRecording(true);
    recognition.start();
    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setSearchQuery(voiceQuery);
      handleSearch(voiceQuery); // Send the recognized word for search
      stopRecording(); // Stop recording after recognition
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.stop();
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-seasalt shadow-lg">
      {/* Logo */}
      <img width="144" src={Logo} alt="Logo" />

      {/* Search Bar */}
      <div className="flex items-center">
        <div className="hidden md:flex items-center bg-white_smoke rounded-lg shadow-inner p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="ml-2 outline-none bg-transparent text-black"
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange} // Use handleInputChange for typing search
          />
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="ml-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {isRecording ? <FaStopCircle /> : <FaMicrophone />}
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="block md:hidden focus:outline-none ml-4" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-black transform hover:scale-110 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Menu items */}
      <ul
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-seasalt md:bg-transparent py-4 md:py-0 items-center md:items-center md:justify-center shadow-md md:shadow-none`}
      >
        <Link to="/"><li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-mikado_yellow transition-all duration-200">Home</li></Link>
        <Link to="/about"><li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-mikado_yellow transition-all duration-200">About us</li></Link>

        {!auth.role && (
          <>
            <Link to="/register">
              <li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-mikado_yellow transition-all duration-200">Become Contributor</li>
            </Link>
            <Link to="/login">
              <li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-risd_blue transition-all duration-200">Login</li>
            </Link>
          </>
        )}

        {auth.role === 'admin' && (
          <Link to="/admin">
            <li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-risd_blue transition-all duration-200">Admin Panel</li>
          </Link>
        )}

        {auth.role === 'contributor' && (
          <Link to="/contributor-panel">
            <li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-risd_blue transition-all duration-200">Contributor Panel</li>
          </Link>
        )}

        {auth.role && (
          <li className="font-semibold text-black py-2 md:py-0 transform hover:scale-105 hover:text-red-500 transition-all duration-200 cursor-pointer" onClick={handleLogout}>
            Logout
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
