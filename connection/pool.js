const mysql = require('mysql')

const pool = mysql.createConnection
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crmfood',
    multipleStatements: true
})

pool.connect(function(error)
{
  console.log('connected to db, CRM-Food');
  if (error) {
    console.log(' Error when connecting to db:' + error)
  }
})

module.exports = pool
