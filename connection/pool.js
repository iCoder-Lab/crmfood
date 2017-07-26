var mysql = require('mysql')

var pool = mysql.createConnection
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crmfood'
})

pool.connect(function(error)
{
  console.log('connected to db, CRM-Food');
  if (error) {
    console.log(' Error when connecting to db:' + error)
    setTimeout(handleDisconnect, 1000)
  }
})

module.exports = pool
