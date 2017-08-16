var jwt = require('jsonwebtoken')
var async = require('async')
var pool = require('../connection/pool')
var ensureToken = require('./tokens')

module.exports = function(app) {
  app.get('/tables', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM tables', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result)
            }
          });
        })
      }
    });
  });

  app.get('/roles', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM roles', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/departments', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM departments', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/users', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers.login, function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM users', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result)
            }
          });
        })
      }
    });
  });

  app.get('/login/:login/:password', function(request, response){
    let inp = request.params;
    let login = inp.login;
    let password = inp.password;

    let token = jwt.sign({login}, login, { expiresIn: "1 day"});
    pool.getConnection(function(err, connection) {
      async.waterfall([
        function(callback) {
          let getUserID = 'SELECT id FROM users WHERE login = ' + connection.escape(login) + ' AND password = ' + connection.escape(password);
          connection.query(getUserID, function(error, userID) {
            if(error || userID.length < 1) {
              callback("invalid login or password");
            }
            else {
              callback(null, userID[0].id)
            }
          });
        },
        function(userID, callback) {
          let deletePrev = 'DELETE FROM tokens WHERE userid = ' + connection.escape(userID);
          connection.query(deletePrev, function(error, rows) {
            if(error) {
              callback("internal error");
            }
            else {
              callback(null, userID);
            }
          });
        },
        function(userID, callback) {
          let insertNew = 'INSERT INTO tokens(token, userid) VALUES(' + connection.escape(token) + ', ' + connection.escape(userID) + ')';
          connection.query(insertNew, function(error, inserted) {
           if(error) {
             callback("internal error");
           }
           else {
             callback(null, userID);
           }
         });
        },
        function(userID, callback) {
         let getRoleID = 'SELECT roleid FROM users WHERE id = ' + connection.escape(userID);
         connection.query(getRoleID, function(error, roleID) {
           if(error || roleID.length < 1) {
             callback("user does not have roleid");
           }
           else {
             callback(null, roleID[0].roleid);
           }
         });
        }],
      function (error, result) {
        connection.release()
        if(error) {
          response.status(404).send({error: error});
        }
        else {
          response.send({roleid: result, token: token});
        }
      });
    })

  });

  app.get('/mealCategories', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM categories', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/categoriesByDepartment/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          const query = 'SELECT * FROM categories WHERE departmentid = ' + connection.escape(request.params.id);
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/statuses', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM statuses', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/servicePercentage', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT value AS percentage FROM variables WHERE name = "percentage"', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result[0]);
            }
          });
        })
      }
    });
  });

  app.get('/meals', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('SELECT * FROM meals', function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/mealsByCategory/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          const query = 'SELECT * FROM meals WHERE categoryid = ' + connection.escape(request.params.id);
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "some internal error"});
            }
            else {
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/orders/:days?', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        let toAdd = ' ';
        if(request.params.days == 1) {
          toAdd = ' WHERE DATE(o.date) = CURDATE() ';
        }
        else if(request.params.days == 7) {
          toAdd = ' WHERE WEEKOFYEAR(o.date) = WEEKOFYEAR(NOW()) ';
        }
        else if(request.params.days == 30) {
          toAdd = ' WHERE YEAR(o.date) = YEAR(NOW()) AND MONTH(o.date) = MONTH(NOW()) ';
        }

        const query = 'SELECT o.id, o.waiterid, t.name AS tablename, o.isitopen, o.date, GROUP_CONCAT(m.id) AS mealid, GROUP_CONCAT(m.name) AS mealname, GROUP_CONCAT(mo.count) AS mealcount, 20 AS total ' +
                      'FROM orders AS o INNER JOIN mealfororder AS mo ON o.id = mo.orderid INNER JOIN meals AS m ON m.id = mo.mealid INNER JOIN tables AS t ON t.id = o.tableid' +
                      toAdd + 'GROUP BY o.id';
        pool.getConnection(function(err, connection) {
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              console.log(error);
              response.status(500).send({error: "some internal error"});
            }
            else {
              result.forEach(function(element) {
                let ids = element.mealid.split(',');
                let names = element.mealname.split(',');
                let counts = element.mealcount.split(',');
                let meals = [];
                names.forEach(function(name, i) {
                  let meal = new Object();
                  meal.id = ids[i];
                  meal.name = name;
                  meal.count = counts[i];
                  meals.push(meal);
                })
                element.meals = meals;
                delete element.mealid;
                delete element.mealname;
                delete element.mealcount;
              })
              response.send(result);
            }
          });
        })
      }
    });
  });

  app.get('/activeOrders', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"});
      }
      else {
        pool.getConnection(function(err, connection) {
          async.waterfall([
            function(callback) {
              let getUserID = 'SELECT id FROM users WHERE login = ' + connection.escape(request.headers['login']);
              connection.query(getUserID, function(error, userID) {
                if(error || userID.length < 1) {
                  callback("invalid login ");
                }
                else {
                  callback(null, userID[0].id);
                }
              });
            },
            function(userID, callback) {
              const query = 'select o.id, o.waiterid, t.name as tablename, o.isitopen, o.date, GROUP_CONCAT(m.id) as mealid, GROUP_CONCAT(m.name) as mealname, GROUP_CONCAT(mo.count) as mealcount '
                          + 'from orders as o inner join mealfororder as mo on o.id = mo.orderid inner join meals as m on m.id = mo.mealid INNER JOIN tables as t ON t.id = o.tableid WHERE o.isitopen = true AND o.waiterid = '
                          + userID + ' GROUP BY o.id'

              connection.query(query, function(error, result) {
                if(error) {
                  console.log(error);
                  callback("some internal error")
                }
                else {
                  result.forEach(function(element) {
                    let ids = element.mealid.split(',')
                    let names = element.mealname.split(',')
                    let counts = element.mealcount.split(',')
                    let meals = []
                    names.forEach(function(name, i) {
                      let meal = new Object()
                      meal.id = ids[i]
                      meal.name = name
                      meal.count = counts[i]
                      meals.push(meal)
                    })
                    element.meals = meals
                    delete element.mealid
                    delete element.mealname
                    delete element.mealcount
                  })
                  callback(null,result)
                }
              })
            }],
          function (error, result) {
            connection.release()
            if(error) {
              response.status(404).send({error: error})
            }
            else {
              response.send(result)
            }
          })
        })

      }
    })
  })

  app.get('/checks', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"})
      }
      else {
        let query = 'SELECT c.id as id, o.id as orderid, c.date as date, CAST((select value from variables where name = "percentage") AS UNSIGNED) as servicefee, '
                  + 'GROUP_CONCAT(m.id) as mealid, GROUP_CONCAT(m.name) as mealname, GROUP_CONCAT(mo.count) as mealcount, GROUP_CONCAT(m.price) as mealprice FROM checks AS c '
                  + 'INNER JOIN orders as o ON o.id = c.orderid INNER JOIN mealfororder as mo ON mo.orderid = o.id INNER JOIN meals AS m on m.id = mo.mealid GROUP BY c.id'
        pool.getConnection(function(err, connection) {
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              console.log(error);
              response.status(500).send({error: "internal error"})
            }
            else {
              result.forEach(function(element) {
                let ids = element.mealid.split(',')
                let names = element.mealname.split(',')
                let counts = element.mealcount.split(',')
                let prices = element.mealprice.split(',')
                let meals = []
                let totalsum = 0
                names.forEach(function(name, i) {
                  let meal = new Object()
                  meal.id = ids[i]
                  meal.name = name
                  meal.count = counts[i]
                  meal.price = prices[i]
                  meal.total = prices[i] * counts[i]
                  totalsum += meal.total
                  meals.push(meal)
                })
                totalsum += (totalsum / 100 * element.servicefee)
                element.meals = meals
                element.totalsum = totalsum
                delete element.mealid
                delete element.mealname
                delete element.mealcount
                delete element.mealprice
              })
              response.send(result)
            }
          })
        })
      }
    })
  })

  app.get('/mealsToOrder/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        let query = 'select o.id, GROUP_CONCAT(m.id) as mealid, GROUP_CONCAT(m.name) as mealname, GROUP_CONCAT(mo.count) as mealcount '
                  + 'from orders as o inner join mealfororder as mo on o.id = mo.orderid inner join meals as m on m.id = mo.mealid WHERE o.id = ' + connection.escape(request.params.id) +' GROUP BY o.id'
        pool.getConnection(function(err, connection) {
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              console.log(error);
              response.status(500).send({error: "wrong order id"})
            }
            else {
              result.forEach(function(element) {
                let ids = element.mealid.split(',')
                let names = element.mealname.split(',')
                let counts = element.mealcount.split(',')
                let meals = []
                names.forEach(function(name, i) {
                  let meal = new Object()
                  meal.id = ids[i]
                  meal.name = name
                  meal.count = counts[i]
                  meals.push(meal)
                })
                element.meals = meals
                delete element.mealid
                delete element.mealname
                delete element.mealcount
              })
              response.send(result)
            }
          })
        })
      }
    })
  })
}
