var Promise = require("bluebird");
var pool = require('../connection/pool');

module.exports = function(app) {
  app.delete('/tables/:id', function(request, response) {
    var query = "DELETE FROM tables WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a table"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/roles/:id', function(request, response) {
    var query = "DELETE FROM roles WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a role"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/departments/:id', function(request, response) {
    var query = "DELETE FROM departments WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a department"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/users/:id', function(request, response) {
    var query = "DELETE FROM users WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such an user"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/mealCategories/:id', function(request, response) {
    var query = "DELETE FROM categories WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a category"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/statuses/:id', function(request, response) {
    var query = "DELETE FROM statuses WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a status"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/servicePercentage', function(request, response) {
    var query = "DELETE FROM servicepercentage"
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is nothing to delete"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/meals/:id', function(request, response) {
    var query = "DELETE FROM meals WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a meal"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/orders/:id', function(request, response) {
    var query = "DELETE FROM orders WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such an order"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/checks/:id', function(request, response) {
    var query = "DELETE FROM checks WHERE id = " + request.params.id
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a check"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  app.delete('/mealsToOrder/:orderid/:mealid', function(request, response) {
    var query = "DELETE FROM mealfororder WHERE orderid = " + request.params.orderid
              + " AND mealid = " + request.params.mealid
    Promise.using(pool(), function(connection) {
      return connection.query(query)
      .then(function(result) {
        if(result.affectedRows > 0) {
          response.send({error: ""})
        }
        else {
          response.status(500).send({error: "there is no such a meal in this order"})
        }
      })
      .catch(function(error) {
        response.status(404).send({error: error})
      })
    })
  })

  // app.delete('/newOrders', function(request, response) {
  //   var query = "DELETE FROM checks WHERE id = " + request.params.id
  //   Promise.using(pool(), function(connection) {
  //     return connection.query(query)
  //     .then(function(result) {
  //       if(result.affectedRows > 0) {
  //         response.send({error: ""})
  //       }
  //       else {
  //         response.status(500).send({error: "there is no such a check"})
  //       }
  //     })
  //     .catch(function(error) {
  //       response.status(404).send({error: error})
  //     })
  //   })
  // })

}
