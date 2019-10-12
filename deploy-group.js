const GroupDeployer =  require("./groupDeployer");
const AWS = require("aws-sdk")

// const credentials = new AWS.SharedIniFileCredentials({
//   profile: "personal"
// });
// AWS.config.credentials = credentials;
ggClient = new AWS.Greengrass({ region: "eu-west-2" });

const deployer = new GroupDeployer.GroupDeployer(ggClient);
deployer
  .listGroups()
  .then(res => {
    return deployer.getVersions();
  })
  .then(res => {
    return deployer.deployLatest();
  })
  .then(res => {
    console.log(deployer.deploymentId);
  })
  .catch(err => {
    console.log(err);
  });

const waitForDeployment = (err, data) => {
  if (err) {
    throw err;
  }

  console.log("waiting for deployment");
  deployed = false;
  ggClient.getDeploymentStatus(
    (params = {
      GroupId: groupId,
      DeploymentId: deploymentId
    }),
    (err, data) => {
      if (err) {
        throw err;
      }

      if (data.DeploymentStatus == "Success") {
        deployed = true;
      }
    }
  );
  console.log(deployed);
  console.log(err, data);
  if (!deployed) {
    setTimeout((err, data) => waitForDeployment(err, data), 5000);
  } else {
    console.log("deployed");
  }
};
