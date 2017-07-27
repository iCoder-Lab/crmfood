var async = require('async')
var jwt = require('jsonwebtoken')
var connection = require('../connection/pool')
var ensureToken = require('./tokens')
const bP = require('body-parser').json()

module.exports = function(app) {
  app.post('/tables', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        if (typeof inp.name === 'string' || inp.name instanceof String) {
          connection.query('INSERT INTO tables(name) VALUES(' + connection.escape(inp.name) + ')',
          function(error, result) {
            if(error) {
              response.status(500).send({error: "some internal error"})
            }
            else {
              response.send({error: ""})
            }
          })
        }
        else {
          response.status(404).send({error: "data type is wrong!"})
        }
      }
    })
  })

  app.post('/roles', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('INSERT INTO roles(name) VALUES(' + connection.escape(inp.name) + ')',
        function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send({error: ""})
          }
        })
      }
    })
  })

  app.post('/departments', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('INSERT INTO departments(name) VALUES(' + connection.escape(inp.name) + ')',
        function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send({error: ""})
          }
        })
      }
    })
  })

  app.post('/users', bP, ensureToken, function(request, response) {
    var inp = request.body
    var name = inp.name
    var surname = inp.surname
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        if ((typeof name === 'string' || name instanceof String) &&
            (typeof surname === 'string' || surname instanceof String)) {
          var login = surname.substr(0, (surname.indexOf(' ') < 0) ? (surname.length):surname.indexOf(' ')) + '_'
                    + name.substr(0, (name.indexOf(' ') < 0) ? (name.length):name.indexOf(' '))
          async.waterfall([
            function(callback) {
              var checkForLogin = 'SELECT login FROM users WHERE login LIKE "' + login.toLowerCase() + '%" ORDER BY login Desc LIMIT 1'
              connection.query(checkForLogin, function(error, rows) {
                var number = ""
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
              var insertUser = 'INSERT INTO users(roleid, name, surname, login, password, phone, email) VALUES(' + inp.roleid + ', "'
                          + name + '", "' + surname + '", "' + login.toLowerCase() + '", "' + inp.phone + '","' + inp.phone + '", "' + inp.email + '")'
              connection.query(insertUser, function(error, rows) {
                if(error) {
                  callback("could not insert this user")
                }
                else {
                  callback(null, "")
                }
              })
            }

          ], function (error, result) {
            if(error) {
              response.send({error: error})
            }
            else {
              response.send({error: result})
            }
          })
        }
        else {
          response.status(400).send({error: "wrong data type"})
        }
      }
    })
  })

  app.post('/mealCategories', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        var query = 'INSERT INTO categories(name, departmentid) VALUES("' + inp.name + '", ' + inp.departmentid + ')'
        connection.query(query,
        function(error, result) {
          if(error) {
            response.status(500).send({error: "wrong department id"})
          }
          else {
            response.send({error: ""})
          }
        })
      }
    })
  })

  app.post('/statuses', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('INSERT INTO statuses(name) VALUES(' + connection.escape(inp.name) + ')',
        function(error, result) {
          if(error) {
            response.status(500).send({error: "internal error"})
          }
          else {
            response.send({error: ""})
          }
        })
      }
    })
  })

  app.post('/servicePercentage', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        var query = 'INSERT INTO variables(name, value) VALUES("percentage", ' + inp.percentage + ')'
        connection.query(query,
          function(error, result) {
            if(error) {
              response.status(500).send({error: "internal error"})
            }
            else {
              response.send({error: ""})
            }
        })
      }
    })
  })

  app.post('/meals', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        var query = 'INSERT INTO meals(name, categoryid, description, price) VALUES("' + inp.name + '", ' + inp.categoryid  + ', "'
                  + inp.description + '", ' + inp.price + ')'
        connection.query(query,
        function(error, result) {
          if(error) {
            response.status(500).send({error: "internal error"})
          }
          else {
            response.send({error: ""})
          }
        })
      }
    })
  })

  app.post('/orders', bP, ensureToken, function(request, response) {
     var inp = request.body
     jwt.verify(request.token, request.headers['login'], function(error, data) {
       if(error) {
         console.log(error);
         response.status(404).send({error: "invalid heasder"})
       }
       else {
         async.waterfall([
           function(callback) {
             var getUserID = 'SELECT id FROM users WHERE login = "' + request.headers['login'] + '"'
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
             var insertOrder = 'INSERT INTO orders(waiterid, tableid) VALUES(' + userID + ', ' + inp.tableid + ');'
             connection.query(insertOrder, function(error, order) {
               if(error || order == null || order == undefined) {
                 callback("cannot insert order")
               }
               else {
                 callback(null, order.insertId)
               }
             })
           },
           function(orderID, callback) {
            var _query =  ""
            inp.meals.forEach(function(item) {
              _query += "INSERT INTO mealfororder(orderid, count, statusid, mealid) VALUES(" + orderID + ", " + item.count + ', (SELECT id FROM statuses WHERE name = "to do"),' + item.id + ");"
            })
	           connection.query(_query, function(error, result) {
               if(error) {
                 deleteEverything(orderID)
                 callback(error)
               }
               else {
                 callback(null, "")
               }
             })
           }

         ], function (error, result) {
           if(error) {
             response.status(400).send({error: error})
           }
           else {
             response.send({error: result})
           }
         })
       }
     })
   })

  function deleteEverything(orderID) {
    async.waterfall([
      function(callback) {
        var deleteOrder = 'DELETE FROM orders WHERE id = ' + orderID
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
        var deleteMealForOrder = 'DELETE FROM mealfororder WHERE orderid = ' + orderID
        connection.query(deleteMealForOrder, function(error, order) {
          if(error) {
            callback("cannot delete mealfororder")
          }
          else {
            callback(null, "")
          }
        })
      }
    ], function (error, result) {
      if(error) {
        console.log(error)
      }
      else {
        console.log(result)
      }
    })
  }

  app.post('/checks', bP, ensureToken, function(request, response) {
    var inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        if (typeof inp.orderid === 'number' || inp.orderid instanceof Number) {
          async.waterfall([
            function(callback) {
              var query = 'INSERT INTO checks(orderid) VALUES(' + inp.orderid + ')'
              connection.query(query,
              function(error, result) {
                if(error) {
                  callback("internal error")
                }
                else {
                  callback(null, inp.orderid)
                }
              })
            },
            function(orderID, callback) {
              var updateStatus = 'UPDATE orders SET isitopen = 0 WHERE id = ' + orderID
              connection.query(updateStatus, function(error, order) {
                if(error) {
                  callback("could not insert this user")
                }
                else {
                  callback(null, "")
                }
              })
            }

          ], function (error, result) {
            if(error) {
              response.send({error: error})
            }
            else {
              response.send({error: result})
            }
          })

        }
        else {
          response.status(404).send({error: "data type is wrong!"})
        }
      }
    })
  })

  // app.post('/mealsToOrder', bP, ensureToken, function(request, response) {
  //   var inp = request.body
  //   jwt.verify(request.token, request.headers['login'], function(error, data) {
  //     if(error) {
  //       console.log(error);
  //       response.status(404).send({error: "invalid heasder"})
  //     }
  //     else {
  //       if (typeof inp.orderid === 'number' || inp.orderid instanceof Number) {
  //         async.waterfall([
  //           function(callback) {
  //             for(var i = 0; i < inp.meals.length; ++i) {
  //               var mealForOrder = 'INSERT INTO mealfororder(orderid, count, statusid, mealid) VALUES(' + inp.orderid + ', '  + inp.meals[i].count + ', '
  //                         + '(SELECT id FROM statuses WHERE name = "to do"),' + inp.meals[i].id +')'
  //               connection.query(mealForOrder, function(error, order) {
  //                 if(error) {
  //                   callback("could not insert this user")
  //                 }
  //               })
  //             }
  //             callback(null, "")
  //           }
  //         ], function (error, result) {
  //           if(error) {
  //             response.send({error: error})
  //           }
  //           else {
  //             response.send({error: result})
  //           }
  //         })
  //       }
  //       else {
  //         response.status(404).send({error: "data type is wrong!"})
  //       }
  //     }
  //   })
  // })

}
