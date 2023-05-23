//Connection to database
const mysql = require('mysql2')
const util = require('util');
const { database } = require('./keys')

const pool = mysql.createPool(database)

//We create the connection and make sure we don't have connection errors
pool.getConnection((err, connection) => { 
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS')
        }
        else if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED')
        }
        console.log(err)
    }

    if (connection) {
        connection.release()
        console.log('DB IS CONNECTED')
    }
    return;
})

const query = util.promisify(pool.query).bind(pool); //everytime we do a query on our pool we can use promises and async await

module.exports = { query, pool }