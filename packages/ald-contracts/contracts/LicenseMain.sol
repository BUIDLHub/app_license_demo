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
     * @dev get vendor information for a registered vendor with the given address
     * @param _vendor is the vendor address
     */
    function vendorInfo(address _vendor)
            public view returns(uint256, uint256, string memory) {
        return mainStorage.vendorInfo(_vendor);
    }
    
    /**
     * @dev withdraw license fees from vendor's account
     */
    function withdrawVendorBalance() public {
        mainStorage.withdrawVendorBalance();
    }

    /**
     * @dev Check whether the given address belongs to a registered vendor
    */
    function isRegisteredVendor(address _v) public view returns(bool) {
        return mainStorage.isRegisteredVendor(_v);
    }

    /**
     * @dev get vendor product info at a specific id offset in the vendor's product list
     * @param _vendorId is the vendor id to query
     * @param _index is the offset for product id
     */
    function vendorProductInfo(uint256 _vendorId, uint256 _index)
            public view returns(uint256, uint256, uint256, uint256, string memory) {
        return mainStorage.vendorProductInfo(_vendorId, _index);
    }

     /**
     * @dev Get product vendor, spec count, license count, and name registered with the given id
     * @param _prodID is product id
     */
    function productInfo(uint256 _prodID)
            public view returns(uint256, uint256, uint256, uint256, string memory) {
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

