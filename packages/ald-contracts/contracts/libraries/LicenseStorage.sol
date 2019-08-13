pragma solidity >=0.4.21 <0.6.0;

/**
 * @title LicenseStorage
 * @dev Contains all the storage members for the Licensing logic contracts
*/
library LicenseStorage {
    
    
    /**
     * @title Vendor
     * @dev Vendor represents a product provider and holds all registered product IDs
    */
    struct Vendor {
        //revenue balance
        uint256 balance;

        //all product IDs for this vendor
        uint256[] productIDs;

        //name of the vendor
        string name;
    }

    /**
     * @title Product
     * @dev Product holds metadata for itself, its licenses, and purchase history
    */
    struct Product {

        //the vendor that owns this product
        uint256 vendorID;

        //id counter for specs associated with this product
        uint256 _specCount;

        //number of licenses issued for this product
        uint256 _licenseCount;

        //the name of this product
        string name;

        //mapping of license spec ids to specs
        mapping(uint256=>LicenseSpecs) specs;
    }

    /**
      * @title LicenseMetadata
      * @dev metadata for a license specification licensee that is mapped to an address
    */
    struct LicenseMetadata {

        //license id held by some address
        uint256 licenseID;

        //a counter nonce to prevent replay attacks when signing authorization hash for access
        uint256 verificationNonce;
    }

    /**
     * @title LicenseSpecs
     * @dev LicenseSpecs holds fields for purchasing and creating license instances
    */
    struct LicenseSpecs {
        //the price for the license in wei
        uint256 price;

        //custom attributes to associate with issued licenses
        uint256 attributes;

        //the duration of the license. Zero indicates no expiration
        uint256 duration;

        //used for null-checks primarily
        bool hasData;

        //name of the license being issued (feature name, etc.)
        string name;

        //the spec is the lowest level element of the hierarchy prior to issuing license NFT.
        //At this level, addresses should only have a single license that hold these
        //specs. This mapping is from their address to the unique license ID
        mapping(address => LicenseMetadata) licensees;
    }

    /**
     * @title License
     * @dev License holds fields for product feature licenses
    */
     struct License {

        //product this license is associated with
        uint256 productID;

        //the actual specification ID this license is based on
        uint256 specID;

        //when the license expires
        uint256 expiration;

        //the block in which this license was issued.
        uint256 issuedBlock;
    }

    /**
     * @title MainStorage
     * @dev Storage for the entire contract. This can be fronted by Proxy contract separating
     * logic from data. Do NOT alter order of variables once deployed as this will corrupt
     * all existing stored data. You can append new fields as needed.
    */
    struct MainStorage {

        //vendor ID counter
        uint256 _vendorCount;

        //product ID counter
        uint256 _productCount;

        //license ID counter
        uint256 _licenseCount;

        //flag to make sure we're only used by the proxy contract
        bool proxied;

        //vendors by id
        mapping(uint256=>Vendor) vendors;

        //mapping of vendor's address to its offset in the vendor list
        mapping(address => uint256) vendorIDsByAddress;

        //licenses by id
        mapping(uint256=>License) licenses;

        //products by id
        mapping(uint256 => Product) products;

       
    }

   
}