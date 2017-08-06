var mysql = require('mysql');               // Mysql include


var db_config = { host : 'localhost', user : 'root', password : 'root', database : 'crmfood',};

var connection = mysql.createConnection(db_config);

function handleDisconnect() {
    console.log('handleDisconnect()');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
    connection.connect(function(err) {              // The server is either down
    if(err) {                                      // or restarting (takes a while sometimes).
        console.log(' Error when connecting to db:', err);
        setTimeout(handleDisconnect, 1000);         // We introduce a delay before attempting to reconnect,
    }                                               // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.

    connection.on('  Database Error', function(err) {
        console.log('db error: ' + err.code, err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                       // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                // server variable configures this)
        }
    });
}
connection.connect(function(err) {
  if(err) {
      console.log('Connection is asleep (time to wake it up): ', err);
      setTimeout(handleDisconnect, 3000);
  }
});

module.exports = connection
