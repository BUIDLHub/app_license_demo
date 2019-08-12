pragma solidity >=0.4.21 <0.6.0;

import "../LicenseToken.sol";
import "../libraries/LicenseStorage.sol";
import "../libraries/LicenseLogic.sol";

contract LicenseManager {
    using LicenseLogic for LicenseStorage.MainStorage;

     //event emitted when a license purchase is made
    event LicenseIssued(address indexed owner, uint256 indexed productID, uint256 specID, uint256 licenseID);

    //event emitted when registered new license specifications
    event SpecsRegistered(uint256 indexed productID, uint256 indexed specID, uint256 attributes, string name, uint256 price, uint256 duration);


    modifier proxyOnly() {
        require(mainStorage.proxied, "Must be called by proxy");
        _;
    }

    LicenseStorage.MainStorage mainStorage;
    LicenseToken erc721;

    /**
     * @dev initialize the contract with a deployed ERC721 contract
    */
    function init(LicenseToken _erc721) public {
        require(!mainStorage.proxied, "Already initialized");
        mainStorage.proxied = true;
        erc721 = _erc721;
    }

    /**
     * @dev issue a new license for the caller for the given product based on the given license specification.
     * @param _productID is the product id for which a license is being issued
     * @param _specID is the specification for the license being purchased
     */
    function issueLicense(uint256 _productID, uint256 _specID)
        external payable proxyOnly {
        uint256 id = mainStorage.addLicense(_productID, _specID, msg.value);
        erc721.mint(msg.sender, id);
    }

    /**
     * @dev verify that an address, who signed the given token hash, owns a
     * license for the given product/spec id combination. This will also verify
     * that the license has not expired.
     * @param _holder is the address to verify which must have also signed the given token
     * @param _productID is the product to check
     * @param _specID is the product's license specification to check
     * @param _token is a hash of some value that was signed by the address holder
     * @param v is part of sig
     * @param r is part of sig
     * @param s is part of sig
     */
    function verifyLicense(address _holder, uint256 _productID, uint256 _specID,
                           bytes32 _token, uint8 v, bytes32 r, bytes32 s)
        external proxyOnly view returns(bool) {
        address test = ecrecover(_token, v, r, s);
        if(test != _holder) {
            return false;
        }
        LicenseStorage.Product storage p = mainStorage.products[_productID];
        require(p.vendorID > 0, "Unknown Product");
        LicenseStorage.LicenseSpecs storage spec = p.specs[_specID];
        require(spec.hasData, "Unknown License Spec");
        uint256 lid = spec.licensees[_holder];
        if(lid == 0) {
            return false;
        }
        address actual = erc721.ownerOf(lid);
        if (actual != test) {
            return false;
        }
        LicenseStorage.License storage l = mainStorage.licenses[lid];
        if(l.expiration > 0 && l.expiration < now) {
            return false;
        }
    }
}