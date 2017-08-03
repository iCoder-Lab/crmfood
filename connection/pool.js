const mysql = require('mysql')

const pool = mysql.createConnection
({
    host: 'localhost',
    user: 'root',
<<<<<<< HEAD
    password: 's0mer@nd0M',
=======
    password: 'root',
>>>>>>> 85369ab3c1e3e3bd0ac323477e9f0e0c4f0c728e
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
