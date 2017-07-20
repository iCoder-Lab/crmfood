var Promise = require("bluebird");
var pool = require('../connection/pool');

module.exports = function(app) {
  app.get('/tables', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM tables')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/roles', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM roles')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/departments', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM departments')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/users', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM users')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/userLogin/:login', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM users WHERE login = ' + connection.escape(request.params.login))
      .then(function(result) {
        response.send(result[0])
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/mealCategories', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM categories')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/statuses', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM statuses')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/servicePercentage', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT percentage FROM servicepercentage')
      .then(function(result) {
        response.send(result[0])
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.get('/meals', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM meals')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  /*app.get('/orders', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM orders')
      .then(function(result) {
        console.log(result);
        response.send(result)
      })
      .catch(function(error) {
        response.send({error: error})
      })
    })
  })*/


  app.get('/orders', function(request, response)
  {
    const _query = 'select o.id as id, o.waiterid as waiterid, o.tableid as tableid, ' +
    'o.isitopen as isitopen, o.date as date, m.id as mealid, m.name as mealname, m.price as mealprice from orders o inner join ' +
    'mealfororder mfo on o.id = mfo.orderid inner join meals m on m.id = mfo.mealid;'

    Promise.using(pool(), function(connection)
    {
      return connection.query(_query)
      .then(function(res)
      {
        if(res.length > 0)
        {
          var ob = JSON.parse(JSON.stringify(res))
          var last = []
          var t = {}
          var oid = ob[0].id
          var count = 0
          var meal = {}
          t.meals = []
          for(var i = 0; i < ob.length; i++) {
            if(oid != ob[i].id) {
              oid = ob[i].id
              last.push(t)
              t = {}
              t.meals = []
            }

            t.id = ob[i].id
            t.waiterid = ob[i].waiterid
            t.tableid = ob[i].tableid
            t.isitopen = ob[i].isitopen
            t.date = ob[i].date
            meal.mealid = ob[i].mealid
            meal.mealname = ob[i].mealname
            meal.mealprice = ob[i].mealprice
            //t.meals.push(meal)
            t.meals.push(ob[i].mealid)
            meal = {}
          }

          if(t.length != 0)
          {
            last.push(t)
          }

          response.json(last)
        }

        else
        {
          response.status(404).send({error: 'no any order for current userid found.'})
        }
      })
      .catch(function(error)
      {
        response.send({error: error})
      })
    })
  })
}
