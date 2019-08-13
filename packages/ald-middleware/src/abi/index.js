import Address from './Address.json';
import Counters from './Counters.json';
import ERC165 from './ERC165.json';
import SafeMath from './SafeMath.json';
import Roles from './Roles.json';
import Ownable from './Ownable.json';
import MinterRole from './MinterRole.json';
import LicenseToken from './LicenseToken.json';
import LicenseStorage from './LicenseStorage.json';
import LicenseMain from './LicenseMain.json';
import ERC721Mintable from './ERC721Mintable.json';
import ERC721Metadata from './ERC721Metadata.json';
import ERC721Full from './ERC721Full.json';
import LicenseManager from './LicenseManager.json';
import LicenseLogic from './LicenseLogic.json';
import ERC721Enumerable from './ERC721Enumerable.json';
import ERC721 from './ERC721.json';

const ALL = [
    Address,
Counters,
 ERC165,
 SafeMath ,
 Roles,
 Ownable,
 MinterRole,
 LicenseToken,
 LicenseStorage,
 LicenseMain,
 ERC721Mintable,
 ERC721Metadata,
 ERC721Full,
 LicenseManager,
 LicenseLogic,
 ERC721Enumerable,
 ERC721
];

export default [
    ...Address.abi,
    ...Counters.abi,
    ...ERC165.abi,
    ...SafeMath.abi,
    ...Roles.abi,
    ...Ownable.abi,
    ...MinterRole.abi,
    ...LicenseToken.abi,
    ...LicenseStorage.abi,
    ...LicenseMain.abi,
    ...ERC721Mintable.abi,
    ...ERC721Metadata.abi,
    ...ERC721Full.abi,
    ...LicenseManager.abi,
    ...LicenseLogic.abi,
    ...ERC721Enumerable.abi,
    ...ERC721.abi
]