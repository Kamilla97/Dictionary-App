const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Generate an access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN, // Short-lived token
    });
};

// Generate a refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d', // Long-lived token
    });
};

// Handle user registration
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }


        // Create a new user
        const user = await User.create({
            username,
            password: password,
            role,
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Handle user login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Validate password
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate tokens
        const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN, // Short-lived token
        });

        const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d', // Long-lived token
        });

        // Optionally, store the refresh token in the database

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken, // Send the refresh token as well
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};

// Handle token refresh
exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(403).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate a new access token
        const newAccessToken = generateAccessToken(decoded);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};
