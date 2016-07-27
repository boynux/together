// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm')
.subClass({ imageMagick: true }); // Enable ImageMagick integration.
var util = require('util');

// constants
var MAX_WIDTH  = 100;
var MAX_HEIGHT = 100;

AWS.config.update({
    region: "eu-central-1",
    // endpoint: "http://localhost:8000"
});

// get reference to S3 client 
exports.handler = function(event, context, callback) {
  // Read options from the event.
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));

  async.waterfall([
      function createTable(next) {
        var dynamodb = new AWS.DynamoDB();
        const params = {
          TableName : "location",
          KeySchema: [       
          { AttributeName: "user", KeyType: "HASH"},  //Partition key
          { AttributeName: "seen", KeyType: "RANGE" }  //Sort key
          ],
          AttributeDefinitions: [       
          { AttributeName: "user", AttributeType: "S" },
          { AttributeName: "seen", AttributeType: "S" }
          ],
          ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
          }
        };

        dynamodb.createTable(params, function(err, data) {
          if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
          }

          if (!err || err.code == "ResourceInUseException") {
            next(null, true);
          } else {
            next(err);
          }
        });

      },
      function storeLocation(cont, next) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName: "location",
          Item: {
            "user": "1",
            "seen": new Date().toISOString(),
            "location": {
              "latitude": event.latitude, 
              "longitude": event.longitude 
            }
          }
        };

        docClient.put(params, function(err, data) {
          if (err) {
            console.error("Unable to add location ", 1, ". Error JSON:", JSON.stringify(err, null, 2));
            next(err);
          } else {
            console.log("PutItem succeeded:", 1);
            next();
          }
        });
      },
      function upload(next) {
        next();
      }
  ], function (err) {
    var msg = "Success!";
    if (err) {
      console.error("Error: " + err);
      msg = "Error!";
    }

    context.done(err, msg);
  });
};

