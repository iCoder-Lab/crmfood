const async = require('async')
const jwt = require('jsonwebtoken')
const pool = require('../connection/pool')
const ensureToken = require('./tokens')
const bP = require('body-parser').json()

module.exports = function(app) {
  app.put('/users', bP, ensureToken, function(request, response) {
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
          pool.getConnection(function(err, connection) {
            let insertUser = 'UPDATE users SET name = ' + connection.escape(inp.name) + ', surname = ' + connection.escape(inp.surname) + ', password = '
                           + connection.escape(inp.password) + ', email = ' + connection.escape(inp.email) + ', phone = ' + connection.escape(inp.phone)
                           + ' WHERE id = ' + connection.escape(inp.id)
            connection.query(insertUser, function(error, rows) {
              connection.release()
              if(error) {
                response.status(400).send({error: "error during the query, wrong arguments"})
              }
              else {
                response.send({error:""})
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

  app.put('/meals', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          let query = 'UPDATE meals SET name = ' + connection.escape(inp.name) + ', price = ' + connection.escape(inp.price)
                    + ', description = ' + connection.escape(inp.description) + ' WHERE id = ' + connection.escape(inp.id)
          connection.query(query, function(error, result) {
            connection.release()
            if(error) {
              response.status(400).send({error: "error during the query, wrong arguments"})
            }
            else {
              response.send({error: ""})
            }
          })
        })
      }
    })
  })

  app.put('/changePassword', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          async.waterfall([
            function(callback) {
              let query = "SELECT id FROM users WHERE login = " + connection.escape(request.headers['login'])
                        + " AND password = " + connection.escape(inp.oldpassword)
               connection.query(query, function(error, result) {
                 if(error) {
                   callback(error)
                 }
                 else {
                   if(result.length > 0) {
                     callback(null, result[0].id)
                   }
                   else {
                     callback("wrong old password")
                   }
                 }
               })
             },
             function(userid, callback) {
               let query = "UPDATE users SET password = " + connection.escape(inp.newpassword) + " WHERE id = " + connection.escape(userid)
                connection.query(query, function(error, result) {
                  if(error) {
                    callback("error, cannot change password")
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
    })
  })

  app.put('/orders', bP, ensureToken, function(request, response) {
    let inp = request.body
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        console.log(error);
        response.status(401).send({error: "invalid header"})
      }
      else {
        pool.getConnection(function(err, connection) {
          async.waterfall([
            function(callback) {
              let deleteMeals =  "DELETE FROM mealfororder WHERE orderid = " + inp.orderid

               connection.query(deleteMeals, function(error, result) {
                 if(error) {
                   console.log(error);
                   callback("error during the query, wrong arguments")
                 }
                 else {
                   callback(null)
                 }
               })
             },
             function(callback) {
               let insertMeals = ""
               inp.meals.forEach(function(item) {
                 insertMeals += "INSERT INTO mealfororder(orderid, count, statusid, mealid) VALUES(" + connection.escape(inp.orderid) + ", "
                         + connection.escape(item.count) + ', (SELECT id FROM statuses WHERE name = "to do"), ' + connection.escape(item.id) + ") ON DUPLICATE KEY UPDATE count = count + "
                         + connection.escape(item.count) + ';'
               })
              connection.query(insertMeals, function(error, result) {
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
    })
  })
}
