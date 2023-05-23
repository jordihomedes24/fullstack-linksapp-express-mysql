const {config} = require('dotenv')

config()

module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT || '3306',
    },

    frontend: {
        port: process.env.PORT || '3000'
    }
}