var app = require('express')();
var server = require('http').Server(app);
// var io = require('socket.io')(server)
// const jwt = require('jsonwebtoken')

server.listen(3000, '');
console.log('Listening to CRM-Food -> 3000');

var postRequests = require('./controllers/postRequests');
var putRequests = require('./controllers/putRequests');
var getRequests = require('./controllers/getRequests');
var deleteRequests = require('./controllers/deleteRequests');

postRequests(app);
putRequests(app);
getRequests(app);
deleteRequests(app);

//-----------------------------------------------------------------------------
// users = []
// connections = []
// app.get('/', function(req, res){
//   res.sendFile(__dirname+'/index.html')
// })
// io.on('connection', function(socket){
//   connections.push(socket)
//   console.log('connected ' + connections.length + ' elements');
//
//   socket.on('disconnect', function(data){
//     if(!socket.username) return
//     users.splice(users.indexof(socket.username), 1)
//     updateUserNames()
//     connections.splice(connections.indexof(socket), 1)
//     console.log('disconnected: ' + connections.length + ' elements');
//   })
//
//   socket.on('send message', function(data){
//     socket.emit('new message', {msg: data})
//   })
//
//   socket.on('new user', function(data){
//     callback(true)
//     socket.username = data
//     users.push(socket.username)
//     updateUserNames()
//   })
//
//   function updateUserNames() {
//     sockets.emit('get users', usernames)
//   }
//
//   app.post('/addOrder', bP, function(request, response) {
//     var file = request.body
//     var waiterid = file.waiterid
//     var tableid = file.tableid
//     const insertOrder = 'insert into orders(status, userid, tableid) values(-1, ' + waiterid + ', ' + tableid + ');'
//     pool.query(insertOrder, function(error, result) {
//       if(error) {
//         response.status(500).send({error: 'query failed: ' + error})
//       }
//       else {
//         socket.emit('new message', {msg: {tableid:tableid,}});
//         response.send({error: ''})
//       }
//     })
//   })
//
//   app.post('/addMealsToOrder', bP, function(request, response) {
//     var file = request.body
//     var orderid = file.orderid
//     var meals = file.meals
//     for(var i = 0; i < meals.length; i++) {
//       const addToOrder = 'insert into mealfororder(orderid, mealid) values(' + orderid + ', ' + meals[i] + ');'
//       pool.query(addToOrder, function(error, result) {
//         if(error) {
//           response.status(500).send({error: 'query failed: ' + error})
//           return
//         }
//         socket.emit('new message', {msg: "order"});
//       })
//     }
//     response.json({error: ''})
//   })
// })
