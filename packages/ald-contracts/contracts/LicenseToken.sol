pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract LicenseToken is Ownable, ERC721Full, ERC721Mintable {
    constructor() Ownable() ERC721Full("LicenseToken", "LICN") ERC721Mintable() public {}
}