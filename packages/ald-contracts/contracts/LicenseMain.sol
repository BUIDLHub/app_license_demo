pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";

import "./LicenseToken.sol";
import "./libraries/LicenseStorage.sol";
import "./libraries/LicenseLogic.sol";
import "./LicenseManager.sol";

contract LicenseMain is Ownable, LicenseManager {
    using LicenseLogic for LicenseStorage.MainStorage;
    
    /**
     * @dev init initializes the license management contract with an initial root vendor/product
     * owned by the contract owner.
     */
    constructor(LicenseToken _erc721) LicenseManager(_erc721) public {
        registerVendor("RootVendor");
        registerProduct("RootProduct");
    }

    /**
    * @dev register a new vendor with the contract. Throws if address already registered as vendor.
     */
    function registerVendor(string memory _name) public {
        mainStorage.addVendor(_name);
    }

    /**
     * @dev register a new product. Caller must be a valid vendor address.
     */
    function registerProduct(string memory _name) public {
        mainStorage.addProduct(_name);
    }

    /**
     * @dev register new license specs for a product. Caller must be a registered vendor
     * that owns the given product.
     */
    function registerLicenseSpecs(uint256 _productID,
                                  uint256 _attributes,
                                  string memory _name,
                                  uint256 _price,
                                  uint256 _duration) public {
        mainStorage.addLicenseSpecs(_productID, _attributes, _name, _price, _duration);
    }

     /**
     * @dev get the name of a vendor by its id.
     * @param _vendorId is registered vendor id
     */
    function vendorName(uint256 _vendorId) public view returns(string memory) {
        return mainStorage.vendorName(_vendorId);
    }

     /**
     * @dev Get product vendor, spec count, license count, and name registered with the given id
     * @param _prodID is product id
     */
    function productInfo(uint256 _prodID)
            public view returns(uint256, uint256, uint256, string memory) {
        return mainStorage.productInfo(_prodID);
    }

    /**
     * @dev get license specification information based on its product and spec IDs
     * @param _productID is the id for the product that owns the spec
     * @param _specID is the license spec id
     */
    function licenseSpecsInfo(uint256 _productID, uint256 _specID)
            public view returns(uint256, uint256, uint256, string memory) {
        return mainStorage.licenseSpecsInfo(_productID, _specID);
    }

    /**
     * @dev get license product ID, attributes, expiration, and issued block based on its id
     * @param _licenseID is the license id to query
    */
    function licenseInfo(uint256 _licenseID)
            public view returns(uint256, uint256, uint256, uint256) {
        return mainStorage.licenseInfo(_licenseID);
    }

}

