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

function greengrassHelloWorldRun(event) {
  if (event.go_local) {
    iotClient.publish(
      {
        topic: "hello/worldpythonfunc",
        payload: JSON.stringify({
          ...event,
          touchedBy: "javascript"
        })
      },
      publishCallback
    );
} else {
  iotClient.publish(
      {
        topic: "hello/world",
        payload: JSON.stringify({
          ...event,
          touchedBy: "javascript"
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

  greengrassHelloWorldRun(event);

  callback(null, response);
};
