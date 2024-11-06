// config.js
const configs = {
    development: {
        API_URL: "http://localhost:3006"
    },
    production: {
        API_URL: "https://api.example.com"
    }
};

const currentEnv = process.env.NODE_ENV || "development";

module.exports = configs[currentEnv];
