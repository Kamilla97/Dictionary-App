const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();


router.get('/users', authenticateToken, authorizeRole(['admin']), userController.getUsers);
router.delete('/users/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);




router.post('/refresh-token', authController.refreshToken);

router.post('/register/', authController.register);


router.post('/login/', authController.login);

module.exports = router;
