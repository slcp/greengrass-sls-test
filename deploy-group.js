aws = require("aws-sdk");

let groupId;
// const credentials = new aws.SharedIniFileCredentials({
//   profile: "personal"
// });
// aws.config.credentials = credentials;
ggClient = new aws.Greengrass({ region: "eu-west-2" });

const getVersions = (err, data) => {
  console.log(
    err,
    data.Groups.filter(group => group.Name == "DemoTestGroupNewName")[0].Id
  );
  groupId = data.Groups.filter(group => group.Name == "DemoTestGroupNewName")[0]
    .Id;
  ggClient.listGroupVersions(
    {
      GroupId: data.Groups.filter(
        group => group.Name == "DemoTestGroupNewName"
      )[0].Id
    },
    (err, data) => {
      deployLatest(err, data);
    }
  );
};

const deployLatest = (err, data) => {
  console.log(err, data.Versions.sort(compare));
  ggClient.createDeployment(
    {
      DeploymentType: "NewDeployment",
      GroupId: groupId,
      GroupVersionId: data.Versions.sort(compare)[0].Version /* required */
    },
    (err, data) => {
      console.log(err, data);
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

console.log("starting");
ggClient.listGroups({}, (err, data) => {
  getVersions(err, data);
});
console.log("deployed");
