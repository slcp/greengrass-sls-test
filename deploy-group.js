aws = require("aws-sdk");

let groupId, versionId;
// const credentials = new aws.SharedIniFileCredentials({
//   profile: "personal"
// });
// aws.config.credentials = credentials;
ggClient = new aws.Greengrass({ region: "eu-west-2" });

const getVersions = (err, data) => {
  if (err) {
    throw err;
  }

  groupId = data.Groups.filter(group => group.Name == "DemoTestGroupNewName")[0]
    .Id;

  ggClient.listGroupVersions(
    {
      GroupId: groupId
    },
    (err, data) => {
      deployLatest(err, data);
    }
  );
};

const deployLatest = (err, data) => {
  if (err) {
    throw err;
  }

  versionId = data.Versions.sort(compare)[0].Version;

  ggClient.createDeployment(
    {
      DeploymentType: "NewDeployment",
      GroupId: groupId,
      GroupVersionId: versionId
    },
    (err, data) => {
      if (err) {
        throw err;
      }

      console.log(`successfully deployed with deploymentId: ${data}`);
    }
  );
};

const compare = (a, b) => {
  let aDate = new Date(a.CreationTimestamp);
  let bDate = new Date(b.CreationTimestamp);

  if (aDate < bDate) {
    return 1;
  }
  if (aDate > bDate) {
    return -1;
  }
  return 0;
};

ggClient.listGroups({}, (err, data) => {
  if (err) {
    throw err;
  }

  getVersions(err, data);
});
