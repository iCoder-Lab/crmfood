var jwt = require('jsonwebtoken')
var async = require('async')
var connection = require('../connection/pool')
var ensureToken = require('./tokens')

module.exports = function(app) {
  app.get('/tables', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM tables', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  app.get('/roles', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM roles', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  app.get('/departments', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM departments', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  app.get('/users', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM users', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  app.get('/login/:login/:password', function(request, response){
    var inp = request.params
    var login = inp.login
    var password = inp.password

    var token = jwt.sign({login}, login, { expiresIn: "2 days"})

    async.waterfall([
      function(callback) {
        var getUserID = 'SELECT id FROM users WHERE login = "' + login + '" AND password = "' + password + '"'
        connection.query(getUserID, function(error, userID) {
          if(error || userID.length < 1) {
            callback("invalid login or password")
          }
          else {
            callback(null, userID[0].id)
          }
        })
      },
      function(userID, callback) {
        var deletePrev = 'DELETE FROM tokens WHERE userid = ' + userID
        connection.query(deletePrev, function(error, rows) {
          if(error) {
            callback("internal error")
          }
          else {
            callback(null, userID)
          }
        })
      },
      function(userID, callback) {
        var insertNew = 'INSERT INTO tokens(token, userid) VALUES("' + token + '", ' + userID + ')'
        connection.query(insertNew, function(error, inserted) {
         if(error) {
           callback("internal error")
         }
         else {
           callback(null, userID)
         }
        })
      },
      function(userID, callback) {
       var getRoleID = 'SELECT roleid FROM users WHERE id = ' + userID
       connection.query(getRoleID, function(error, roleID) {
         if(error || roleID.length < 1) {
           callback("user does not have roleid")
         }
         else {
           callback(null, roleID[0].roleid)
         }
       })
      }
    ], function (error, result) {
      if(error) {
        response.status(404).send({error: error})
      }
      else {
        response.send({roleid: result, token: token})
      }
    })
  })

  app.get('/mealCategories', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM categories', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  app.get('/statuses', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM statuses', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  app.get('/servicePercentage', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT value AS percentage FROM variables WHERE name = "percentage"', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result[0])
          }
        })
      }
    })
  })

  app.get('/meals', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        connection.query('SELECT * FROM meals', function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            response.send(result)
          }
        })
      }
    })
  })

  // app.get('/getAllOrders', function(request, response) {
  //   Promise.using(pool(), function(connection) {
  //     return connection.query('SELECT id, waiterid, tableid, isitopen, date FROM orders')
  //     .then(function(result) {
  //       response.send(result)
  //     })
  //     .catch(function(error) {
  //       response.status(404).send({error: error})
  //     })
  //   })
  // })

  // app.get('/orders', function(request, response) {
  //   const _query = 'select o.id as id, o.waiterid as waiterid, o.tableid as tableid, ' +
  //   'o.isitopen as isitopen, o.date as date, m.id as mealid, m.name as mealname, m.price as mealprice from orders o inner join ' +
  //   'mealfororder mfo on o.id = mfo.orderid inner join meals m on m.id = mfo.mealid;'
  //
  //   Promise.using(pool(), function(connection)
  //   {
  //     return connection.query(_query)
  //     .then(function(res)
  //     {
  //       if(res.length > 0)
  //       {
  //         var ob = JSON.parse(JSON.stringify(res))
  //         var last = []
  //         var t = {}
  //         var oid = ob[0].id
  //         var count = 0
  //         var meal = {}
  //         t.meals = []
  //         for(var i = 0; i < ob.length; i++) {
  //           if(oid != ob[i].id) {
  //             oid = ob[i].id
  //             last.push(t)
  //             t = {}
  //             t.meals = []
  //           }
  //
  //           t.id = ob[i].id
  //           t.waiterid = ob[i].waiterid
  //           t.tableid = ob[i].tableid
  //           t.isitopen = ob[i].isitopen
  //           t.date = ob[i].date
  //           meal.mealid = ob[i].mealid
  //           meal.mealname = ob[i].mealname
  //           meal.mealprice = ob[i].mealprice
  //           //t.meals.push(meal)
  //           t.meals.push(ob[i].mealid)
  //           meal = {}
  //         }
  //
  //         if(t.length != 0)
  //         {
  //           last.push(t)
  //         }
  //
  //         response.json(last)
  //       }
  //
  //       else
  //       {
  //         response.status(404).send({error: 'no order for current userid found.'})
  //       }
  //     })
  //     .catch(function(error)
  //     {
  //       response.send({error: error})
  //     })
  //   })
  // })

  // app.get('/checks', function(request, response) {
  //   Promise.using(pool(), function(connection) {
  //     return connection.query('SELECT o.id AS orderid, o.date, GROUP_CONCAT(m.name) AS name, GROUP_CONCAT(m.price) AS price FROM orders AS o, mealfororder AS mo INNER JOIN meals AS m ON m.id = mo.mealid WHERE mo.orderid = o.id GROUP BY o.id')
  //     .then(function(result) {
  //       // result.forEach(function(row) {
  //       //   var price = row.price.toString().toString().split(',').map(function(value) {
  //       //     return {price : Number(value)}
  //       //   })
  //       //   var name = row.name.toString().toString().split(',').map(function(value) {
  //       //     return {name : String(value)}
  //       //   })
  //       //   row.meals = price + name
  //       // })
  //       response.send(result)
  //     })
  //     .catch(function(error) {
  //       response.status(404).send({error: error})
  //     })
  //   })
  // })
  //
  // app.get('/mealsToOrder', function(request, response) {
  //   Promise.using(pool(), function(connection) {
  //     var query = 'SELECT id AS uniqueid, orderid, GROUP_CONCAT(mealid) AS meals FROM mealfororder GROUP BY orderid'
  //     return connection.query(query)
  //     .then(function(result) {
  //       result.forEach(function(row) {
  //         row.mealid = row.meals.toString().split(',').map(function(value) {
  //           return Number(value)
  //         })
  //         delete row.meals
  //       })
  //       response.send(result)
  //     })
  //     .catch(function(error) {
  //       response.status(404).send({error: error})
  //     })
  //   })
  // })
  //
  // app.get('/getMealsByCategory/:categoryid', function(request, response) {
  //   var inp = request.params.categoryid
  //   if(Number.isInteger(parseInt(inp)))
  //   {
  //     const categoryid = parseInt(inp)
  //     const _query = 'select m.id as id, m.name as name, m.categoryid, m.price as price from meals m inner join categories c ' +
  //     'on c.id = m.categoryid where c.id = '
  //
  //     Promise.using(pool(), function(connection)
  //     {
  //       return connection.query(_query + connection.escape(categoryid))
  //       .then(function(result)
  //       {
  //         response.send(result)
  //       })
  //       .catch(function(error)
  //       {
  //         response.status(404).send({error: error})
  //       })
  //     })
  //   }
  //
  //   else
  //   {
  //     response.send('Category id should be a positive integer value')
  //   }
  // })
  //
}
