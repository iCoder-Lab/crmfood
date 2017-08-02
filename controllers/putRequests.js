const async = require('async')
const jwt = require('jsonwebtoken')
const connection = require('../connection/pool')
const ensureToken = require('./tokens')
const bP = require('body-parser').json()

module.exports = function(app) {
  // app.put('/users', bP, ensureToken, function(request, response) {
  //   let inp = request.body
  //   let name = inp.name
  //   let surname = inp.surname
  //   jwt.verify(request.token, request.headers['login'], function(error, data) {
  //     if(error) {
  //       console.log(error);
  //       response.status(404).send({error: "invalid heasder"})
  //     }
  //     else {
  //       if ((typeof name === 'string' || name instanceof String) &&
  //           (typeof surname === 'string' || surname instanceof String)) {
  //         async.waterfall([
  //           function(callback) {
  //             let checkForLogin = 'SELECT login FROM users WHERE login LIKE ' + connection.escape(login.toLowerCase() + '%') + ' ORDER BY login Desc LIMIT 1'
  //             connection.query(checkForLogin, function(error, rows) {
  //               let number = ""
  //               if(rows.length > 0) {
  //                 number = rows[rows.length-1].login.match(/\d+/)
  //                 if(number != null) {
  //                   number = parseInt(number) + 1
  //                 }
  //                 else {
  //                   number = 1
  //                 }
  //               }
  //               login = login + number
  //               callback(null, login)
  //             })
  //           },
  //           function(login, callback) {
  //             let insertUser = 'INSERT INTO users(roleid, name, surname, login, password, phone, email) VALUES(' + connection.escape(inp.roleid) + ', '
  //                         + connection.escape(name) + ', ' + connection.escape(surname) + ', ' + connection.escape(login.toLowerCase()) + ', ' + connection.escape(inp.phone) + ','
  //                         + connection.escape(inp.phone) + ', ' + connection.escape(inp.email) + ')'
  //             connection.query(insertUser, function(error, rows) {
  //               if(error) {
  //                 callback("could not insert this user")
  //               }
  //               else {
  //                 callback(null, {login:login.toLowerCase(), password: inp.phone})
  //               }
  //             })
  //           }
  //
  //         ], function (error, json) {
  //           if(error) {
  //             response.status(500).send({error: error})
  //           }
  //           else {
  //             response.send(json)
  //           }
  //         })
  //       }
  //       else {
  //         response.status(400).send({error: "wrong data type"})
  //       }
  //     }
  //   })
  // })
  //
  // app.put('/meals', bP, ensureToken, function(request, response) {
  //   let inp = request.body
  //   jwt.verify(request.token, request.headers['login'], function(error, data) {
  //     if(error) {
  //       console.log(error);
  //       response.status(404).send({error: "invalid heasder"})
  //     }
  //     else {
  //       let query = 'INSERT INTO meals(name, categoryid, description, price) VALUES(' + connection.escape(inp.name) + ', ' + connection.escape(inp.categoryid)  + ', '
  //                 + connection.escape(inp.description) + ', ' + connection.escape(inp.price) + ')'
  //       connection.query(query,
  //       function(error, result) {
  //         if(error) {
  //           response.status(500).send({error: "internal error"})
  //         }
  //         else {
  //           response.send({error: ""})
  //         }
  //       })
  //     }
  //   })
  // })
}
