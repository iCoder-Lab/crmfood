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

  app.get('/categoriesByDepartment/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        const query = 'SELECT * FROM categories WHERE departmentid = ' + request.params.id
        connection.query(query, function(error, result) {
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


  app.get('/mealsByCategory/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        const query = 'SELECT * FROM meals WHERE categoryid = ' + request.params.id
        connection.query(query, function(error, result) {
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

  app.get('/orders', ensureToken, function(request, response) {
    const query = 'select o.id, o.waiterid, o.tableid, o.isitopen, o.date, GROUP_CONCAT(m.id) as mealid, GROUP_CONCAT(m.name) as mealname, GROUP_CONCAT(mo.count) as mealcount from orders as o inner join mealfororder as mo on o.id = mo.orderid inner join meals as m on m.id = mo.mealid GROUP BY o.id'

    connection.query(query, function(error, result) {
      if(error) {
        console.log(error);
        response.status(500).send({error: "some internal error"})
      }
      else {
        result.forEach(function(element) {
          var ids = element.mealid.split(',')
          var names = element.mealname.split(',')
          var counts = element.mealcount.split(',')
          var meals = []
          names.forEach(function(name, i) {
            var meal = new Object()
            meal.id = ids[i]
            meal.name = name
            meal.count = counts[i]
            var jsonMeal = JSON.stringify(meal)
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
