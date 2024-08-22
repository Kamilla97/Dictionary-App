const { User } = require('../models'); // Assuming User is a Sequelize model

// Get paginated list of users
exports.getUsers = async (req, res) => {
    try {
        // Get page and limit from query parameters, set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch users with pagination
        const { rows: users, count } = await User.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'username', 'email', 'role'], // Only select necessary fields
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        res.json({
            users,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Delete the user by ID
        const deleted = await User.destroy({ where: { id: userId } });

        if (deleted) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
