var LicenseToken = artifacts.require("./LicenseToken.sol");
var LicenseLogic = artifacts.require("./libraries/LicenseLogic.sol");
var LicenseMain = artifacts.require("./LicenseMain.sol");

module.exports = async function(deployer) {
    //deploy ERC721 contract
    await deployer.deploy(LicenseToken);

    //load logic library
    await LicenseLogic.deployed();

    //link to main
    await deployer.link(LicenseLogic, LicenseMain);

    //deploy main
    await deployer.deploy(LicenseMain, LicenseToken.address);

    await LicenseToken.deployed().then(async inst=>{
        await inst.addMinter(LicenseMain.address);
    });
    
}
