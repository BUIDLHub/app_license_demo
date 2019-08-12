var LicenseLogic = artifacts.require("./libraries/LicenseLogic.sol");

module.exports = async function(deployer) {
    //deploy the logic library that manipulates storage
    await deployer.deploy(LicenseLogic);
}