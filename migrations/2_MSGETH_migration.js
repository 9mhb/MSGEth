const MSGETH = artifacts.require("MSGETH");

module.exports = function (deployer) {
  deployer.deploy(MSGETH);
};
