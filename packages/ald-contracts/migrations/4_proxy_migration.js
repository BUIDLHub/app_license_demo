/*var LicenseToken = artifacts.require("./LicenseToken.sol");
var LicenseMain = artifacts.require("./LicenseMain.sol");
var LicenseProxy = artifacts.require("./LicenseProxy.sol");
var LicenseLogic = artifacts.require("./libraries/LicenseLogic.sol");*/

module.exports = async function(deployer) {
    //load token address
    /*
    await LicenseToken.deployed();

    //load main address
    await LicenseMain.deployed();

    //load logic lib
    await LicenseLogic.deployed();
    console.log("Token address", LicenseToken.address);
    console.log("Main address", LicenseMain.address);
    console.log("Logic address", LicenseLogic.address);

    //link the logic to the proxy
    await deployer.link(LicenseLogic, LicenseProxy);

    let con = new web3.eth.Contract(LicenseMain.abi, LicenseMain.address);
    let encoded = con.methods.init(LicenseToken.address).encodeABI();

    //and deploy new proxy
    await deployer.deploy(LicenseProxy, LicenseToken.address, LicenseMain.address, encoded);
    */
}