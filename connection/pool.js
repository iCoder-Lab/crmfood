var mysql = require('promise-mysql');

pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'crmfood'
});

function getSqlConnection() {
  return pool.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}

module.exports = getSqlConnection;
