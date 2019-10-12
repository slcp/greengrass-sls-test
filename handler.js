"use strict";

const ggSdk = require("aws-greengrass-core-sdk");

const iotClient = new ggSdk.IotData();
const os = require("os");
const util = require("util");

function publishCallback(err, data) {
  console.log(err);
  console.log(data);
}

const myPlatform = util.format("%s-%s", os.platform(), os.release());
const pubOpt = {
  topic: "hello/world",
  payload: JSON.stringify({
    message: util.format(
      "Redeploy quickly with new message deploying same version",
      myPlatform
    )
  })
};

function greengrassHelloWorldRun() {
  iotClient.publish(pubOpt, publishCallback);
}

module.exports.testGreengrassFunctionOne = (event, context, callback) => {
  console.log("invoked greengrass");
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "invoked"
    })
  };

  greengrassHelloWorldRun();

  callback(null, response);
};
