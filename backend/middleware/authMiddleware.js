const jwt = require('jsonwebtoken');

// Authenticate access token
exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token expired or invalid :'+err });
    }
};

// Authorize based on user role
exports.authorizeRole = (role) => {
    return (req, res, next) => {
        console.log(role.includes(req.user.role))
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        next();
    };
};
