const async = require('async')
const jwt = require('jsonwebtoken')
const connection = require('../connection/pool')
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
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        if ((typeof name === 'string' || name instanceof String) &&
            (typeof surname === 'string' || surname instanceof String)) {
          let insertUser = 'UPDATE users SET name = ' + connection.escape(inp.name) + ', surname = ' + connection.escape(inp.surname) + ', password = '
                         + connection.escape(inp.password) + ', email = ' + connection.escape(inp.email) + ', phone = ' + connection.escape(inp.phone)
                         + ' WHERE id = ' + connection.escape(inp.id)
          connection.query(insertUser, function(error, rows) {
            if(error) {
              response.status(500).send({error:"could not insert this user"})
            }
            else {
              response.send({error:""})
            }
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
        response.status(404).send({error: "invalid heasder"})
      }
      else {
        let query = 'UPDATE meals SET name = ' + connection.escape(inp.name) + ', price = ' + connection.escape(inp.price)
                  + ', description = ' + connection.escape(inp.description) + ' WHERE id = ' + connection.escape(inp.id)
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
}
