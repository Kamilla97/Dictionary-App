const express = require('express');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const { Word, Meaning, Definition, WordStatistics, User, LikeDislikeLog } = require('./models');

dotenv.config();

(async () => {


    const app = express();
    // Sync database and start server
    sequelize.sync() 
        .then(() => {
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });
        })
        .catch(err => console.log('Error syncing database:', err));
})();
 