var mysql = require('mysql')

var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1amcoder',
    database: 'LiveSport'
})

module.exports = pool
