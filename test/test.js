var expect = require('chai').expect
var request = require('superagent')

var PactOpts = {
  consumer: 'PactUI',             // the name of your consumer
  provider: 'Projects Provider',  // the name of your Provider
  providerPort: 8181							// the port on which the provider runs
}

PactConsumer(PactOpts, function () {

  // this is wrapped in a before() block
  // it takes an Array of interactions
  addInteractions([{
    state: 'i can store location',
    uponReceiving: 'a request to store location',
    withRequest: {
      method: 'post',
      path: '/index/handler',
      headers: { 'Accept': 'text/html', 'Content-Type': 'application/json'},
      body: { 'latitude': "1.0", 'longitude': "2.1" },
    },
    willRespondWith: {
      status: 200,
      body: "Success!"
    }
  }])

  function requestProjects () {
    return request
      .post('http://localhost:' + PactOpts.providerPort + '/index/handler')
      .set({'Content-Type': 'application/json'})
      .set({'Accept': 'text/html'})
      .send({'latitude': "1.0", 'longitude': "2.1"})
  }

  // this is your 'it' block
  verify('Location is stored', requestProjects, function (result, done) {
    expect(result).to.eql("Success!")
    done();
  })

  // this is wrapped in a after block
  // thus it runs after all your verify's
  // it writes the pact and clear all interactions
  finalizePact()

})

