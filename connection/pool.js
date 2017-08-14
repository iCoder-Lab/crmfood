var mysql = require('mysql')

var connection  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1amcoder',
    database: 'LiveSport'
})

module.exports = connection
