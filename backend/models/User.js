const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class User extends Model {
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'contributor'),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: (user) => {
            user.password = bcrypt.hashSync(user.password, 10);
        }
    }
});

// Function to create a default admin user if not exists
const createDefaultAdmin = async () => {
    try {
        const defaultAdmin = await User.findOne({ where: { username: 'admin' } });
        
        if (!defaultAdmin) {
            await User.create({
                id: 1,
                username: 'admin',
                password: 'admin', // Password will be hashed in the beforeCreate hook
                email: 'admin@dictionary.com',
                role: 'admin'
            });
            console.log('Default admin user created.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
};

// Call the function to create the default admin when the model is synced
sequelize.sync().then(() => {
    createDefaultAdmin();
});

module.exports = User;
