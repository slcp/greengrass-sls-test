"use strict";
const ggSdk = require("aws-greengrass-core-sdk");

const iotClient = new ggSdk.IotData();
const os = require("os");
const fs = require("fs");
const util = require("util");

function publishCallback(err, data) {
  console.log(err);
  console.log(data);
}

const myPlatform = util.format("%s-%s", os.platform(), os.release());

function greengrassHelloWorldRun(message) {
  iotClient.publish(
    {
      topic: "hello/world",
      payload: JSON.stringify({
        message: message
      })
    },
    publishCallback
  );
}

module.exports.testGreengrassFunctionOne = (event, context, callback) => {
  console.log("invoked greengrass");
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "invoked"
    })
  };
  console.log(fs.readdirSync("/home/pi"));
  let raw = fs.readFileSync("/home/pi/testdata/test.json");
  let parsed = JSON.parse(raw);

  greengrassHelloWorldRun(parsed);

  callback(null, response);
};
