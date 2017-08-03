const jwt = require('jsonwebtoken')
const async = require('async')
const connection = require('../connection/pool')
const ensureToken = require('./tokens')

module.exports = function(app) {
  app.delete('/tables/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM tables WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(400).send({error: "there is no such a table"})
            }
          }
        })
      }
    })
  })

  app.delete('/roles/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM roles WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such a role"})
            }
          }
        })
      }
    })
  })

  app.delete('/departments/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM departments WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such a department"})
            }
          }
        })
      }
    })
  })

  app.delete('/users/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM users WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such an user"})
            }
          }
        })
      }
    })
  })

  app.delete('/mealCategories/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM categories WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such a category"})
            }
          }
        })
      }
    })
  })

  app.delete('/statuses/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM statuses WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such a status"})
            }
          }
        })
      }
    })
  })

  app.delete('/servicePercentage', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM variables WHERE name = 'percentage' "
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is nothing to delete"})
            }
          }
        })
      }
    })
  })

  app.delete('/meals/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM meals WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such a meal"})
            }
          }
        })
      }
    })
  })

  app.delete('/orders/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        async.waterfall([
          function(callback) {
            let query = "DELETE FROM mealfororder WHERE orderid = " + request.params.id
            connection.query(query, function(error, result) {
              if(error) {
                callback("could not delete meals of the order")
              }
              else {
                if(result.affectedRows > 0) {
                  callback(null)
                }
                else {
                  callback("there is no such an meal")
                }
              }
            })
          },
          function(callback) {
            let query = "DELETE FROM orders WHERE id = " + request.params.id
            connection.query(query, function(error, result) {
              if(error) {
                callback("could not delete the order")
              }
              else {
                if(result.affectedRows > 0) {
                  callback(null, "")
                }
                else {
                  callback("there is no such an order")
                }
              }
            })
          }
        ], function (error, result) {
          if(error) {
            response.status(404).send({error: error})
          }
          else {
            response.send({error: result})
          }
        })
      }
    })
  })

  app.delete('/checks/:id', ensureToken, function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM checks WHERE id = " + connection.escape(request.params.id)
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error: "some internal error"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error: "there is no such a check"})
            }
          }
        })
      }
    })
  })

  app.delete('/mealsToOrder/:orderid/:mealid', function(request, response) {
    jwt.verify(request.token, request.headers['login'], function(error, data) {
      if(error) {
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = "DELETE FROM mealfororder WHERE orderid = " + request.params.id
        connection.query(query, function(error, result) {
          if(error) {
            response.status(500).send({error:"could not delete meals of the order"})
          }
          else {
            if(result.affectedRows > 0) {
              response.send({error: ""})
            }
            else {
              response.status(500).send({error:"could not delete meals of the order"})
            }
          }
        })
      }
    })
  })
}
