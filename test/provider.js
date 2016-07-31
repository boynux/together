var expect = require('chai').expect
var path = require('path')
var server = require('../provider')

PactProvider({consumer: 'Projects Consumer', provider: 'Projects Provider'}, function () {

	before(function (done) {
		server.listen(8180, done)
	})

  var pactOpts = {
    providerBaseUrl: 'http://localhost:8180',
    pactUrls: [ path.resolve(process.cwd(), 'pacts', 'pactui-projects_provider.json')],
    providerStatesUrl: 'http://localhost:8180/providerStates',
    providerStatesSetupUrl: 'http://localhost:8180/setupProviderStates',
  }

  honourPact(pactOpts, function (result, done) {
    done()
  })

})
