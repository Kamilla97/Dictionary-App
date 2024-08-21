const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/users', userController.getUsers);
router.delete('/users/:id', userController.deleteUser);


router.post('/refresh-token', authController.refreshToken);

router.post('/register/', authController.register);


router.post('/login/', authController.login);

module.exports = router;
