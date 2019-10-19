exports.GroupDeployer = class GroupDeployer {
  constructor(client, groupName = "DemoTestGroupNewName") {
    this.client = client;
    this.groups = [];
    this.versions = [];
    this.groupId = null;
    this.versionId = null;
    this.deploymentId = null;
    this.groupName = groupName;
    this.deployed = false;
  }

  async listGroups() {
    let data = await this.client.listGroups().promise();
    this.groups = data.Groups;
  }

  async getVersions() {
    this.groupId = this.groups.filter(
      group => group.Name == this.groupName
    )[0].Id;

    let data = await this.client
      .listGroupVersions({
        GroupId: this.groupId
      })
      .promise();
    this.versions = data.Versions;
  }

  sortVersions() {
    this.versions = this.versions.sort((a, b) => {
      let aDate = new Date(a.CreationTimestamp);
      let bDate = new Date(b.CreationTimestamp);

      if (aDate < bDate) {
        return 1;
      }
      if (aDate > bDate) {
        return -1;
      }
      return 0;
    });
  }

  async deployLatest() {
    this.sortVersions();
    this.versionId = this.versions[0].Version;

    let data = await this.client
      .createDeployment({
        DeploymentType: "NewDeployment",
        GroupId: this.groupId,
        GroupVersionId: this.versionId
      })
      .promise();
    this.deploymentId = data.DeploymentId;
  }
};
