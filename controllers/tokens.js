function ensureToken(request, response, next) {
  let bearerHeader = request.headers['auth']
  if(typeof bearerHeader !== 'undefined') {
    request.token = bearerHeader
    next()
  }
  else {
    response.status(404).send({error: "need token"})
  }
}

module.exports = ensureToken
