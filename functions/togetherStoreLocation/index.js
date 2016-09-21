// dependencies
var async = require('async');
var AWS = require('aws-sdk');
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
          if (!err || err.code == "ResourceInUseException") {
            next(null, true);
          } else {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            next(err);
          }
        });

      },
      function storeLocation(cont, next) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName: "location",
          Item: {
            "user": event.userId,
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

