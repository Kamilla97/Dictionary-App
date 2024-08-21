const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes/');
const dotenv = require('dotenv');
const { Word, Meaning, Definition, WordStatistics, User, LikeDislikeLog } = require('./models');

dotenv.config();

(async () => {


    const app = express();
    app.use('/api/', routes);
    // Sync database and start server
    sequelize.sync() // Use `alter` to adjust table structures
        .then(() => {
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });
        })
        .catch(err => console.log('Error syncing database:', err));
})();
 