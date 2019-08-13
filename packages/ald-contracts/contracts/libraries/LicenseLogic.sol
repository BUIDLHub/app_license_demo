pragma solidity >=0.4.21 <0.6.0;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./LicenseStorage.sol";

library LicenseLogic {

    using SafeMath for uint256;


    //event emitted when a new vendor is registered
    event VendorRegistered(uint256 indexed vendorID, string name);

    //event emitted when a product is registered
    event ProductRegistered(uint256 productID, string name);

     //event emitted when registered new license specifications
    event SpecsRegistered(uint256 indexed productID, uint256 indexed specID, uint256 attributes, string name, uint256 price, uint256 duration);

     //event emitted when a license purchase is made
    event LicenseIssued(address indexed owner, uint256 indexed productID, uint256 specID, uint256 licenseID, uint256 expiration);

    //event emitted when vendor withdraws balance of license fees
    event VendorWithdraw(address indexed vendor, uint256 amount);

     /**
     * @dev register a vendor that can create products
     * @param main is the main contract storage
     * @param _name is the name of the vendor.
     */
    function addVendor(LicenseStorage.MainStorage storage main, string memory _name) internal {
        require(!_vendorExists(main, msg.sender), "Vendor already exists");
        main._vendorCount = main._vendorCount.add(1);
        uint256 id = main._vendorCount;
        main.vendors[id] = LicenseStorage.Vendor({
            balance: 0,
            productIDs: new uint256[](0),
            name: _name
        });
        main.vendorIDsByAddress[msg.sender] = id;
        emit VendorRegistered(id, _name);
    }

    /**
     * @dev get vendor information for a registered vendor with the given address
     * @param main is contract storage
     * @param _vendor is the vendor address
     */
    function vendorInfo(LicenseStorage.MainStorage storage main, address _vendor)
            internal view returns(uint256, uint256, string memory) {
       uint256 vid = main.vendorIDsByAddress[_vendor];
       require(vid > 0, "Vendor Not Registered ");
       LicenseStorage.Vendor storage v = main.vendors[vid];
       return (vid, v.productIDs.length, v.name);
    }

    /**
     * @dev get the name of a vendor by its id.
     * @param main is contract storage
     * @param _vendorId is registered vendor id
     */
    function vendorName(LicenseStorage.MainStorage storage main, uint256 _vendorId) internal view returns(string memory) {
        require(_vendorId > 0, "Invalid Vendor ID");
        LicenseStorage.Vendor storage v = main.vendors[_vendorId];
        return v.name;
    }

    /**
     * @dev get a vendor's name by its registration address
     * @param main is contract storage
     * @param vend is the vendor address
     */
    function vendorNameByAddress(LicenseStorage.MainStorage storage main, address vend) internal view returns(string memory) {
        uint256 vid = main.vendorIDsByAddress[vend];
        require(vid > 0, "Unregistered Vendor");
        return main.vendors[vid].name;
    }

    /**
     * @dev Check whether the given address belongs to a registered vendor
    */
    function isRegisteredVendor(LicenseStorage.MainStorage storage main, address _vendor) internal view returns(bool) {
        return main.vendorIDsByAddress[_vendor] > 0;
    }

    /**
     * @dev addProduct adds a new product for the vendor associated with the sender.
     * @param main is the main contract storage structure
     * @param _name is the name of the product
     */
    function addProduct(LicenseStorage.MainStorage storage main, string memory _name) internal {
        uint256 vid = main.vendorIDsByAddress[msg.sender];
        require(vid > 0, "Not a registered vendor");
        LicenseStorage.Vendor storage v = main.vendors[vid];
        main._productCount = main._productCount.add(1);
        uint256 id = main._productCount;
        LicenseStorage.Product memory p;
        p.vendorID = vid;
        p.name = _name;
        main.products[id] = p;
        v.productIDs.push(id);
        emit ProductRegistered(id, _name);
    }

    /**
     * @dev get vendor product info at a specific id offset in the vendor's product list
     * @param main is the contract storage
     * @param _vendorId is the vendor id to query
     * @param _index is the offset for product id
     */
    function vendorProductInfo(LicenseStorage.MainStorage storage main, uint256 _vendorId, uint256 _index)
            internal view returns(uint256, uint256, uint256, uint256, string memory) {
        require(_vendorId > 0, "Invalid vendor ID");
        LicenseStorage.Vendor storage v = main.vendors[_vendorId];
        require(_index < v.productIDs.length, "Index out of bounds");
        
        uint256 id = v.productIDs[_index];
        return productInfo(main, id);
    }

    /**
     * @dev Get product vendor, spec count, license count, and name registered with the given id
     * @param main is main storage
     * @param _prodID is product id
     */
    function productInfo(LicenseStorage.MainStorage storage main, uint256 _prodID)
            internal view returns(uint256, uint256, uint256, uint256, string memory) {
        require(_prodID > 0, "Invalid Product ID");
        LicenseStorage.Product storage p = main.products[_prodID];
        require(p.vendorID > 0, "Unregistered Product");
        return (p.vendorID, _prodID, p._specCount, p._licenseCount, p.name);
    }

    /**
     * @dev add new license specifications for the given product ID. Requires that the
     * caller be a registered vendor and the owner of the given productID.
     * @param main is main contract storage
     * @param _productID is the product id to add specs to
     * @param _attributes are custom attributes that will be passed to any newly issued license
     * @param _name is the name of the license that will be issued (feature, etc)
     * @param _price is the price to buy a license. Zero value means free license.
     * @param _duration is how long a license will last. Zero value means no expiration
     */
    function addLicenseSpecs(LicenseStorage.MainStorage storage main,
                                  uint256 _productID, uint256 _attributes,
                                  string memory _name, uint256 _price,
                                  uint256 _duration)
            internal {
        require(_productID > 0, "Invalid Product ID");
        require(_vendorExists(main, msg.sender), "Not a registered vendor");
        uint256 vid = main.vendorIDsByAddress[msg.sender];
        LicenseStorage.Product storage prod = main.products[_productID];
        require(vid == prod.vendorID, "Not product owner");
        prod._specCount = prod._specCount.add(1);
        uint256 sid = prod._specCount;
        prod.specs[sid] = LicenseStorage.LicenseSpecs({
            attributes: _attributes,
            price: _price,
            duration: _duration,
            name: _name,
            hasData: true
        });

        emit SpecsRegistered(_productID, sid, _attributes, _name, _price, _duration);
    }

    /**
     * @dev get license specification information based on its product and spec IDs
     * @param main is contract storage
     * @param _productID is the id for the product that owns the spec
     * @param _specID is the license spec id
     */
    function licenseSpecsInfo(LicenseStorage.MainStorage storage main, uint256 _productID, uint256 _specID)
            internal view returns(uint256, uint256, uint256, string memory) {
        //price, attributes, duration, name
        require(_productID > 0, "Invalid Product ID");
        require(_specID > 0, "Invalid Spec ID");
        LicenseStorage.Product storage p = main.products[_productID];
        require(p.vendorID > 0, "Unregistered product");
        LicenseStorage.LicenseSpecs storage s = p.specs[_specID];
        require(s.hasData, "Unknown license spec");
        return (s.price, s.attributes, s.duration, s.name);
    }

    /**
     * @dev add a new license for the caller for the given product based on the given license specification.
     * @param main is contract storage
     * @param _productID is the product id for which a license is being issued
     * @param _specID is the specification for the license being purchased
     * @param _payment is the payment provided for the purchase
     */
    function addLicense(LicenseStorage.MainStorage storage main, uint256 _productID, uint _specID, uint256 _payment)
            internal returns(uint256) {
        require(_productID > 0, "Invalid Product ID");
        require(_specID > 0, "Invalid Spec ID");
        LicenseStorage.Product storage prod = main.products[_productID];
        require(prod.vendorID > 0, "Unregistered Product");

        LicenseStorage.Vendor storage vendor = main.vendors[prod.vendorID];
        require(vendor.productIDs.length > 0, "Invalid product id");

        LicenseStorage.LicenseSpecs storage spec = prod.specs[_specID];
        require(spec.hasData, "Unknown Spec");
        if(spec.price > 0) {
            require(spec.price == _payment, "Insufficient payment for license");
        }
        main._licenseCount = main._licenseCount.add(1);
        uint lid = main._licenseCount;
        uint256 exp = 0;
        if(spec.duration > 0) {
            exp = now.add(spec.duration);
            require(exp > now, "Expiration computation is off");
        }
        main.licenses[lid] = LicenseStorage.License({
            productID: _productID,
            specID: _specID,
            expiration: exp,
           issuedBlock: block.number
        });
        prod._licenseCount = prod._licenseCount.add(1);

        spec.licensees[msg.sender] = LicenseStorage.LicenseMetadata({
            licenseID: lid,
            verificationNonce: 0
        });

        //TODO: Could take a dev-share here.
        vendor.balance = vendor.balance.add(_payment);
        emit LicenseIssued(msg.sender, _productID, _specID, lid, exp);
        return lid;
    }

    /**
     * @dev get license product ID, attributes, expiration, and issued block based on its id
     * @param main is contract storage
     * @param _licenseID is the license id to query
    */
    function licenseInfo(LicenseStorage.MainStorage storage main, uint256 _licenseID)
            internal view returns(uint256, uint256, uint256, uint256) {
        require(_licenseID > 0, "Invalid License ID");
        LicenseStorage.License storage l = main.licenses[_licenseID];
        require(l.specID > 0, "Invalid license ID");
        LicenseStorage.Product storage p = main.products[l.productID];
        LicenseStorage.LicenseSpecs storage s = p.specs[l.specID];
        require(s.hasData, "Invalid Lisense ID");
        return (l.productID, s.attributes, l.expiration, l.issuedBlock);
    }

    /**
     * @dev withdraw license fees from vendor's account
     * @param main is the storage for contract
     */
    function withdrawVendorBalance(LicenseStorage.MainStorage storage main) internal {
        require(_vendorExists(main, msg.sender), "Not a registered vendor");
        uint256 vid = main.vendorIDsByAddress[msg.sender];
        LicenseStorage.Vendor storage v = main.vendors[vid];
        require(v.balance > 0, "Nothing to withdraw");
        uint amt = v.balance;
        v.balance = 0;
        msg.sender.transfer(amt);
        emit VendorWithdraw(msg.sender, amt);
    }

    /**
     * @dev Check whether a vendor with the given address is already registered
     * @param main is the main contract storage
     * @param vendor is the address to check
     */
    function _vendorExists(LicenseStorage.MainStorage storage main, address vendor) internal view returns(bool) {
        return main.vendorIDsByAddress[vendor] > 0;
    }
}