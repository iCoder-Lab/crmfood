const async = require('async')
const jwt = require('jsonwebtoken')
const pool = require('../connection/pool')
const ensureToken = require('./tokens')
const bP = require('body-parser').json()

module.exports = function(app) {
  app.post('/tables', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(401).send({error: "invalid header"})
      }
      else {
        if (typeof inp.name === 'string' || inp.name instanceof String) {
          pool.getConnection(function(err, connection) {
            async.waterfall([
              function(callback) {
                let check = 'SELECT id FROM tables WHERE name = ' + connection.escape(inp.name)
                connection.query(check, function(error, rows) {
                  if(rows.length > 0) {
                    callback('this table already exists')
                  }
                  else {
                    callback(null)
                  }
                })
              },
              function(callback) {
                let insertTable= 'INSERT INTO tables(name) VALUES(' + connection.escape(inp.name) + ')'
                connection.query(insertTable, function(error, rows) {
                  if(error) {
                    callback("error during the query, wrong arguments")
                  }
                  else {
                    callback(null, "")
                  }
                })
              }],
            function (error, result) {
              connection.release()
              if(error) {
                response.status(400).send({error: error})
              }
              else {
                response.send({error: result})
              }
            })
          })
        }
        else {
          response.status(404).send({error: "data type is wrong!"})
        }
      }
    })
  })

  app.post('/roles', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('INSERT INTO roles(name) VALUES(' + connection.escape(inp.name) + ')',
          function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "error during the query, wrong arguments"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.post('/departments', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('INSERT INTO departments(name) VALUES(' + connection.escape(inp.name) + ')',
          function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "error during the query, wrong arguments"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.post('/users', bP, ensureToken, function(request, response) {
    let inp = request.body
    let name = inp.name
    let surname = inp.surname
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        if ((typeof name === 'string' || name instanceof String) &&
            (typeof surname === 'string' || surname instanceof String)) {
          let login = surname.substr(0, (surname.indexOf(' ') < 0) ? (surname.length):surname.indexOf(' ')) + '_'
                    + name.substr(0, (name.indexOf(' ') < 0) ? (name.length):name.indexOf(' '))
          pool.getConnection(function(err, connection) {
            async.waterfall([
              function(callback) {
                let checkForLogin = 'SELECT login FROM users WHERE login LIKE ' + connection.escape(login.toLowerCase() + '%') + ' ORDER BY login Desc LIMIT 1'
                connection.query(checkForLogin, function(error, rows) {
                  let number = ""
                  if(rows.length > 0) {
                    number = rows[rows.length-1].login.match(/\d+/)
                    if(number != null) {
                      number = parseInt(number) + 1
                    }
                    else {
                      number = 1
                    }
                  }
                  login = login + number
                  callback(null, login)
                })
              },
              function(login, callback) {
                let insertUser = 'INSERT INTO users(roleid, name, surname, login, password, phone, email) VALUES(' + connection.escape(inp.roleid) + ', '
                            + connection.escape(name) + ', ' + connection.escape(surname) + ', ' + connection.escape(login.toLowerCase()) + ', ' + connection.escape(inp.phone) + ','
                            + connection.escape(inp.phone) + ', ' + connection.escape(inp.email) + ')'
                connection.query(insertUser, function(error, rows) {
                  if(error) {
                    callback("error during the query, wrong arguments")
                  }
                  else {
                    callback(null, {login:login.toLowerCase(), password: inp.phone})
                  }
                })
              }],
            function (error, json) {
              connection.release()
              if(error) {
                response.status(500).send({error: "error during the query, wrong arguments"})
              }
              else {
                response.send(json)
              }
            })
          })

        }
        else {
          response.status(400).send({error: "wrong data type"})
        }
      }
    })
  })

  app.post('/mealCategories', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          let query = 'INSERT INTO categories(name, departmentid) VALUES(' + connection.escape(inp.name) + ', ' + connection.escape(inp.departmentid) + ')'
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(400).send({error: "wrong department id"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.post('/statuses', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          connection.query('INSERT INTO statuses(name) VALUES(' + connection.escape(inp.name) + ')',
          function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "error during the query, wrong arguments"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.post('/servicePercentage', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          let query = 'INSERT INTO variables(name, value) VALUES("percentage", ' + connection.escape(inp.percentage) + ')'
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "error during the query, wrong arguments"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.post('/meals', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          let query = 'INSERT INTO meals(name, categoryid, description, price) VALUES(' + connection.escape(inp.name) + ', ' + connection.escape(inp.categoryid)  + ', '
                    + connection.escape(inp.description) + ', ' + connection.escape(inp.price) + ')'
          connection.query(query,
          function(error, result) {
            connection.release()
            if(error) {
              response.status(500).send({error: "error during the query, wrong arguments"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.post('/orders', bP, ensureToken, function(request, response) {
     let inp = request.body
     jwt.verify(request.token, request.headers['login'], function(error, data) {
       if(error) {
         console.log(error);
         response.status(401).send({error: "invalid header"})
       }
       else {
         if(!inp.meals) {
           response.status(400).send({error: "error, send meals"})
         }
         else {
           pool.getConnection(function(err, connection) {
             async.waterfall([
               function(callback) {
                 let checkTable = 'SELECT id FROM orders WHERE isitopen = true AND tableid = ' + connection.escape(inp.tableid)
                 connection.query(checkTable, function(error, rows) {
                   if(error || rows.length > 0) {
                    callback("table is open, close it first")
                   }
                   else {
                    callback(null)
                   }
                 })
               },
               function(callback) {
                 let getUserID = 'SELECT id FROM users WHERE login = ' + connection.escape(request.headers['login'])
                 connection.query(getUserID, function(error, rows) {
                   if(error) {
                    callback("cannot find waiter id")
                   }
                   else {
                    callback(null, rows[0].id)
                   }
                 })
                },
               function(userID, callback) {
                 let insertOrder = 'INSERT INTO orders(waiterid, tableid) VALUES(' + connection.escape(userID) + ', ' + connection.escape(inp.tableid) + ');'
                 connection.query(insertOrder, function(error, order) {
                   if(error || order == null || order == undefined) {
                    callback("error during the query, wrong arguments")
                   }
                   else {
                    callback(null, order.insertId)
                   }
                 })
               },
               function(orderID, callback) {
                 let _query =  ""
                 if(!inp.meals) {
                   response.status(400).send({error: "error during the query, missing meals"})
                 }
                 inp.meals.forEach(function(item) {
                   _query += 'INSERT INTO mealfororder(orderid, count, statusid, mealid) VALUES(' + connection.escape(orderID) + ', ' + connection.escape(item.count)
                           + ', (SELECT id FROM statuses WHERE name = "to do"),' + item.id + ');'
                })
                connection.query(_query, function(error, result) {
                  if(error) {
                    deleteEverything(connection, orderID)
                    callback("wrong meal id")
                  }
                  else {
                    callback(null, "")
                  }
                })
              }
           ],
             function (error, result) {
               connection.release()
               if(error) {
                 response.status(400).send({error: error})
               }
               else {
                 response.send({error: result})
               }
             })
           })
         }
       }
     })
   })

  function deleteEverything(connection, orderID) {
    async.waterfall([
      function(callback) {
        let deleteOrder = 'DELETE FROM orders WHERE id = ' + connection.escape(orderID)
        connection.query(deleteOrder, function(error, rows) {
          if(error) {
            callback("cannot delete order")
          }
          else {
            callback(null)
          }
        })
      },
      function(callback) {
        let deleteMealForOrder = 'DELETE FROM mealfororder WHERE orderid = ' + connection.escape(orderID)
        connection.query(deleteMealForOrder, function(error, order) {
          if(error) {
            callback("cannot delete mealfororder")
          }
          else {
            callback(null, "")
          }
        })
      }],
    function (error, result) {
      if(error) {
        return error
      }
      else {
        return "error during the query, wrong arguments"
      }
    })
  }

  app.post('/checks', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        if (typeof inp.orderid === 'number' || inp.orderid instanceof Number) {
          pool.getConnection(function(err, connection) {
            async.waterfall([
              function(callback) {
                let query = 'INSERT INTO checks(orderid) VALUES(' + connection.escape(inp.orderid) + ')'
                connection.query(query,
                function(error, result) {
                  if(error) {
                    callback("error during the query, wrong arguments")
                  }
                  else {
                    callback(null, inp.orderid)
                  }
                })
              },
              function(orderID, callback) {
                let updateStatus = 'UPDATE orders SET isitopen = 0 WHERE id = ' + connection.escape(orderID)
                connection.query(updateStatus, function(error, order) {
                  if(error) {
                    callback("error during the query, wrong arguments")
                  }
                  else {
                    callback(null, "")
                  }
                })
              }],
            function (error, result) {
              connection.release()
              if(error) {
                response.status(500).send({error: error})
              }
              else {
                response.send({error: result})
              }
            })
          })
        }
        else {
          response.status(404).send({error: "data type is wrong!"})
        }
      }
    })
  })

  app.post('/mealsToOrder', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        if(!inp.meals) {
          response.status(404).send({error: "error, send meals"})
        }
        else {
          pool.getConnection(function(err, connection) {
            async.waterfall([
              function(callback) {
                let _query =  ""
                inp.meals.forEach(function(item) {
                  _query += "INSERT INTO mealfororder(orderid, count, statusid, mealid) VALUES(" + connection.escape(inp.orderid) + ", "
                          + connection.escape(item.count) + ', (SELECT id FROM statuses WHERE name = "to do"), ' + connection.escape(item.id) + ") ON DUPLICATE KEY UPDATE count = count + "
                          + connection.escape(item.count) + ';'
                })
                 connection.query(_query, function(error, result) {
                   if(error) {
                     console.log(error);
                     callback("error during the query, wrong arguments")
                   }
                   else {
                     callback(null, "")
                   }
                 })
               }
             ],
            function (error, result) {
              connection.release()
              if(error) {
                response.status(500).send({error: error})
              }
              else {
                response.send({error: result})
              }
            })
          })
        }
      }
    })
  })
}
