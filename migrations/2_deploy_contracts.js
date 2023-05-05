var Animals  = artifacts.require("./SponsorAnimals.sol");
var Send  = artifacts.require("./SendEther.sol");

module.exports = function(deployer) {
  deployer.deploy(Animals);
  deployer.deploy(Send);
};
