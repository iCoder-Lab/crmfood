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

  app.get('/orders', function(request, response) {
    Promise.using(pool(), function(connection) {
      return connection.query('SELECT * FROM orders')
      .then(function(result) {
        response.send(result)
      })
      .catch(function(error) {
        response.send({error: error})
      })
    })
  })
}
