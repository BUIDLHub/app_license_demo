pragma solidity >=0.4.12 <0.6.0;


import "../../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";
import "../libraries/LicenseStorage.sol";
import "../libraries/LicenseLogic.sol";
import "./LicenseMain.sol";
import "../LicenseToken.sol";

contract LicenseProxy is Ownable {
    using LicenseLogic for LicenseStorage.MainStorage;

    event NewLogicContract(address _newToken, address newMain);

    LicenseStorage.MainStorage mainStorage;
    LicenseMain mainContract;


    /**
    * @dev The constructor sets the current token contract and main contract addresses
    * @param _tokenContract is the address for the deployed ERC721 contract
    * @param _mainContract is the deployed main license contract
    */
    constructor (LicenseToken _tokenContract, LicenseMain _mainContract, bytes memory initTxnData)  public{
        mainContract = _mainContract;
        (bool success, bytes memory _) = address(mainContract).delegatecall(initTxnData);
        require(success, "Could not initialize main license contract");
       
        emit NewLogicContract(address(_tokenContract), address(_mainContract));
    }
    

    function upgradeLogic(LicenseToken _tokenContract, LicenseMain _mainContract, bytes memory initTxnData) public onlyOwner {
        mainContract = _mainContract;
        (bool success, bytes memory _) = address(mainContract).delegatecall(initTxnData);
       
        require(success, "Could not initialize main license contract");
        
        emit NewLogicContract(address(_tokenContract), address(_mainContract));
    }
  

    /**
    * @dev This is the fallback function that allows contracts to call the tellor contract at the address stored
    */
    function () external payable {
        address addr = address(mainContract);
        bytes memory _calldata = msg.data;
        assembly {
            let result := delegatecall(not(0), addr, add(_calldata, 0x20), mload(_calldata), 0, 0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            // revert instead of invalid() bc if the underlying call failed with invalid() it already wasted gas.
            // if the call returned error data, forward it
            switch result case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}