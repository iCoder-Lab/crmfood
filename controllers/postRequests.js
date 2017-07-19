var Promise = require("bluebird")
var pool = require('../connection/pool')
const bP = require('body-parser').json()

module.exports = function(app) {
  app.post('/tables', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.name === 'string' || inp.name instanceof String) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO tables(name) VALUES(' + connection.escape(inp.name) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/roles', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.name === 'string' || inp.name instanceof String) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO roles(name) VALUES(' + connection.escape(inp.name) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/departments', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.name === 'string' || inp.name instanceof String) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO departments(name) VALUES(' + connection.escape(inp.name) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/users', bP, function(request, response) {
    var inp = request.body
    var name = inp.name
    var surname = inp.surname
    if ((typeof name === 'string' || name instanceof String) &&
        (typeof surname === 'string' || surname instanceof String)) {
      var login = surname.substr(0, (surname.indexOf(' ') < 0) ? (surname.length):surname.indexOf(' ')) + '_'
                + name.substr(0, (name.indexOf(' ') < 0) ? (name.length):name.indexOf(' '))
      var checkForLogin = 'SELECT login FROM users WHERE login LIKE "' + login.toLowerCase() + '%" ORDER BY login Desc LIMIT 1'
      Promise.using(pool(), function(connection) {
        return connection.query(checkForLogin)
        .then(function(rows) {
          if(rows.length > 0) {
            var number = rows[rows.length-1].login.match(/\d+/)
            if(number != null) {
              number = parseInt(number) + 1
            }
            else {
              number = 1
            }
            var query = 'INSERT INTO users(roleid, name, surname, login, password, phone) VALUES(' + inp.roleid + ', "'
                        + name + '", "' + surname + '", "' + (login.toLowerCase()+number) + '", "' + inp.phone + '","' + inp.phone + '")'
            connection.query(query)
            .then(function(result){
              response.send({error: ""})
            })
            .catch(function(err){
              response.status(404).send({error: err})
            })
          }
          else {
            var query = 'INSERT INTO users(roleid, name, surname, login, password, phone) VALUES(' + inp.roleid + ', "'
                        + name + '", "' + surname + '", "' + login.toLowerCase() + '", "' + inp.phone + '","' + inp.phone + '")'
            connection.query(query)
            .then(function(result){
              response.send({error: ""})
            })
            .catch(function(err){
              response.status(404).send({error: err})
            })
          }
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/mealCategories', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.name === 'string' || inp.name instanceof String) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO categories(name) VALUES(' + connection.escape(inp.name) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/statuses', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.name === 'string' || inp.name instanceof String) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO statuses(name) VALUES(' + connection.escape(inp.name) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/servicePercentage', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.percentage === 'number' || inp.percentage instanceof Number) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO servicepercentage(percentage) VALUES(' + connection.escape(inp.percentage) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/meals', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.name === 'string' || inp.name instanceof String) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO meals(name, categoryid, price) VALUES(' + connection.escape(inp.name) + ', '
                                + connection.escape(inp.categoryid)  + ', ' + connection.escape(inp.price) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/orders', bP, function(request, response)
  {
     var inp = request.body
     console.log("Meal length -> " + inp.meals.length);
     Promise.using(pool(), function(connection)
     {
       var query = 'INSERT INTO orders(waiterid, tableid) VALUES(' + connection.escape(inp.waiterid) + ', '
                               + connection.escape(inp.tableid)  + ');'
       connection.query(query)
       .then(function(rows)
       {
         for(var i = 0; i < inp.meals.length; i++)
         {
           var m = inp.meals[i]
           var _query = 'INSERT INTO mealfororder(orderid, statusid, mealid) VALUES(' + rows.insertId + ', ' + '(SELECT id FROM statuses WHERE name = "to do"),'
                       + m +')'

           connection.query(_query)
           .then(function(rows)
           {
           })
           .catch(function(err){
             response.status(404).send({error: err})
           })
         }

         response.send({error: ""})
       })
       .catch(function(error)
       {
         response.status(500).send({error: error})
       })
     })
   })

  app.post('/checks', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.orderid === 'number' || inp.orderid instanceof Number) {
      Promise.using(pool(), function(connection) {
        return connection.query('INSERT INTO checks(orderid) VALUES(' + connection.escape(inp.orderid) + ')')
        .then(function(rows) {
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/mealsToOrder', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.orderid === 'number' || inp.orderid instanceof Number) {
      Promise.using(pool(), function(connection) {
        return connection.query('SeLECT * FROM orders WHERE id = ' + connection.escape(inp.orderid))
        .then(function(rows) {
          for(var i = 0; i < inp.meals.length; ++i) {
            var query = 'INSERT INTO mealfororder(orderid, statusid, mealid) VALUES(' + inp.orderid + ', '
                      + '(SELECT id FROM statuses WHERE name = "to do"),' + inp.meals[i] +')'
            connection.query(query)
            .catch(function(error) {
              console.log(error);
            })
          }
          response.send({error: ""})
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

  app.post('/changeStatus', bP, function(request, response) {
    var inp = request.body
    if (typeof inp.uniqueid === 'number' || inp.uniqueid instanceof Number) {
      Promise.using(pool(), function(connection) {
        return connection.query('UPDATE mealfororder SET statusid = ' + connection.escape(inp.statusid) + ' WHERE id = ' + connection.escape(inp.uniqueid))
        .then(function(rows) {
          if(rows.changedRows > 0) {
            response.send({error: ""})
          }
          else {
            response.status(404).send({error: "could not find uniqueid"})
          }
        })
        .catch(function(error) {
          response.status(404).send({error: error})
        })
      })
    }
    else {
      response.status(404).send({error: "data type is wrong!"})
    }
  })

}
