var mysql = require('mysql')

var db_config =
{
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'crmfood',
  multipleStatements: true
}
var connection = mysql.createConnection(db_config);

connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected ... nn");
  } else {
    console.log("Error connecting database ... nn", err);
  }
})

module.exports = connection
