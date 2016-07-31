var path = require('path')
var wrapper = require('@pact-foundation/pact-node')

// create mock server to listen on port 1234
var mockServer = wrapper.createServer({
  port: 8181,
  log: path.resolve(process.cwd(), 'logs', 'mockserver-ui.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  spec: 2
})

// start the mock server
mockServer.start().then(function () {
  // runs Mocha's test suite
  run()
})
