var jwt = require('jsonwebtoken');
var async = require('async');
var pool = require('../connection/pool');
var ensureToken = require('./tokens');

module.exports = function(app) {
  app.delete('/tables/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM tables WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)? "":"there is no such a table"});
            }
          });
        })
      }
    });
  });

  app.delete('/roles/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM roles WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)? "":"there is no such a role"});
            }
          })
        })
      }
    });
  });

  app.delete('/departments/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM departments WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)? "":"there is no such a department"});
            }
          })
        })
      }
    });
  });

  app.delete('/users/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM users WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)? "":"there is no such an user"});
            }
          })
        })
      }
    });
  });

  app.delete('/mealCategories/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM categories WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              console.log(error);
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)? "":"there is no such a category"});
            }
          })
        })
      }
    });
  });

  app.delete('/statuses/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM statuses WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0) ? "":"there is no such a status"});
            }
          });
        })
      }
    });
  });

  app.delete('/servicePercentage', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM variables WHERE name = 'percentage' " +
                      "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0) ? "":"there is nothing to delete"});
            }
          })
        })
      }
    });
  });

  app.delete('/meals/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM meals WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)?"":"there is no such a meal"});
            }
          })
        })
      }
    });
  });

  app.delete('/orders/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          async.waterfall([
            function(callback) {
              var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM mealfororder WHERE orderid = " +
                          connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
              connection.query(query, function(error, result) {
                if(error) {
                  callback("could not delete meals of the order");
                }
                else {
                  callback((result.affectedRows > 0) ? null:"there is no such an meal");
                }
              });
            },
            function(callback) {
              var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM orders WHERE id = " +
                          connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
              connection.query(query, function(error, result) {
                if(error) {
                  callback("could not delete the order");
                }
                else {
                  if(result.affectedRows > 0) {
                    callback(null, "");
                  }
                  else {
                    callback("there is no such an order");
                  }
                }
              });
            }],
          function (error, result) {
            connection.release()
            if(error) {
              response.status(404).send({error: error});
            }
            else {
              response.send({error: result});
            }
          });
        })
      }
    });
  });

  app.delete('/checks/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM checks WHERE id = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send({error: (result.affectedRows > 0)?"":"there is no such a check"});
            }
          });
        })
      }
    });
  });

  app.delete('/mealsToOrder/:orderid/:mealid', function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          var query = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM mealfororder WHERE orderid = " +
                      connection.escape(request.params.id) + "; SET FOREIGN_KEY_CHECKS=1;";
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error:"could not delete meals of the order"});
            }
            else {
              response.send({error: (result.affectedRows > 0)? "":"could not delete meals of the order"});
            }
          });
        })
      }
    });
  });
};
