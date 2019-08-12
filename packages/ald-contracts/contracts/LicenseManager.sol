pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./LicenseToken.sol";
import "./libraries/LicenseStorage.sol";
import "./libraries/LicenseLogic.sol";

contract LicenseManager {
    using LicenseLogic for LicenseStorage.MainStorage;
    using SafeMath for uint256;

     //event emitted when a license purchase is made
    event LicenseIssued(address indexed owner, uint256 indexed productID, uint256 specID, uint256 licenseID);

    //event emitted when registered new license specifications
    event SpecsRegistered(uint256 indexed productID, uint256 indexed specID, uint256 attributes, string name, uint256 price, uint256 duration);

    LicenseStorage.MainStorage mainStorage;
    LicenseToken erc721;

    /**
     * @dev initialize the contract with a deployed ERC721 contract
    */
    constructor(LicenseToken _erc721) public {
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
        external payable {
        uint256 id = mainStorage.addLicense(_productID, _specID, msg.value);
        erc721.mint(msg.sender, id);
    }

    /**
     * @dev find a license ID held by the given address for the given product and license specification IDs.
     * A non-zero return value indicates the user holds a license for the items, but the license
     * needs to be verified for expiration, etc.
     */
    function findLicenseID(address _holder, uint256 _productID, uint256 _specID)
        external view returns(uint256) {
        require(_productID > 0, "Invalid product IDI");
        require(_specID > 0, "Invalid spec ID");
        LicenseStorage.Product storage p = mainStorage.products[_productID];
        require(p.vendorID > 0, "Unregistered product");
        LicenseStorage.LicenseSpecs storage s = p.specs[_specID];
        require(s.hasData, "Invalid spec ID");
        LicenseStorage.LicenseMetadata storage m = s.licensees[_holder];
        return m.licenseID;
    }

    /**
     * @dev check whether the given user has a valid license for the given product and specification IDs.
     * NOTE: This does not authenticate the given address and only verifies that the address
     * as an unexpired license for the given IDs. To authenticate user access, use the verifyLicense function instead.
     */
    function userHasValidLicense(address _holder, uint256 _productID, uint _specID)
        external view returns(bool) {
        uint256 lid = this.findLicenseID(_holder, _productID, _specID);
        if(lid == 0) {
            return false;
        }
        LicenseStorage.License storage lic = mainStorage.licenses[lid];
        if(lic.productID == 0) {
            return false;
        }
        if(lic.expiration < now) {
            return false;
        }
        return true;
    }

    /**
     * @dev verify that an address, who signed the given token hash, owns a
     * license for the given product/spec id combination. This will also verify
     * that the license has not expired.
     * @param _holder is the address to verify which must have also signed the given token
     * @param _licenseID is the license ID to verify
     * @param v is part of sig
     * @param r is part of sig
     * @param s is part of sig
     */
    function verifyLicense(address _holder, uint256 _licenseID,
                           uint8 v, bytes32 r, bytes32 s)
        external returns(bool) {
        
        require(_licenseID > 0, "Invalid license ID");

        LicenseStorage.License storage lic = mainStorage.licenses[_licenseID];
        require(lic.productID > 0, "Invalid license ID");

        LicenseStorage.Product storage p = mainStorage.products[lic.productID];
        require(p.vendorID > 0, "Unknown Product");

        LicenseStorage.LicenseSpecs storage spec = p.specs[lic.specID];
        require(spec.hasData, "Unknown License Spec");

        LicenseStorage.LicenseMetadata storage meta = spec.licensees[_holder];
        require(meta.licenseID > 0, "Must request logic permission hash before attempting to verify license");

        bytes32 _token = generatePermissionHash(_holder, _licenseID);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        address test = ecrecover(keccak256(abi.encodePacked(prefix, _token)), v, r, s);
        require(test == _holder, "Invalid signature");
        address actual = erc721.ownerOf(_licenseID);
        if (actual != test) {
            return false;
        }
        LicenseStorage.License storage l = mainStorage.licenses[_licenseID];
        if(l.expiration > 0 && l.expiration < now) {
            return false;
        }
        meta.verificationNonce = meta.verificationNonce.add(1); //for next verification

        return true;
    }

    /**
     * @dev generatePermissionHash generates a unique hash that must be signed by the given
     * user to verify license ownership.
     * @param user is the user that will sign the returned hash
     * @param _licenseID is the license id that will be verified
    */
    function generatePermissionHash(address user, uint256 _licenseID)
        public view returns(bytes32) {
        require(_licenseID > 0, "Invalid License ID");
        LicenseStorage.License storage lic = mainStorage.licenses[_licenseID];
        require(lic.productID > 0, "Unknown license");

        LicenseStorage.Product storage p = mainStorage.products[lic.productID];
        require(p.vendorID > 0, "Unregistered Product");
        LicenseStorage.LicenseSpecs storage specs = p.specs[lic.specID];
        require(specs.hasData, "Unknown license spec");
        LicenseStorage.LicenseMetadata storage m = specs.licensees[user];
        require(m.licenseID == _licenseID, "License ID doesn't match registered attributes for license");
        uint256 nonce = m.verificationNonce;
        return keccak256(abi.encodePacked(user, _licenseID, nonce));
    }
}