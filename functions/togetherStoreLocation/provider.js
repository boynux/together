var express = require('express')
var bodyParser = require('body-parser')
var invokeTask = require('./invoke')

var server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true}))

server.post('/index/handler', function (req, res) {
  invokeTask.getHandler({}, function(result) {
    res.json(result)
  })(req.body)
})

server.get('/providerStates', function (req, res) {
  res.json({ 'PactUI' : ['i can store location'] })
})

server.post('/providerStates', function (req, res) {
  res.sendStatus(201, {})
})

module.exports = server

