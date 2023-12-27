// SPDX-License-Identifier: CC0


/*
Free Series 3 Deployer
*/

import "./Free21.sol";
import "./Free22.sol";
import "./Free23.sol";
import "./Free24.sol";
import "./Free25.sol";
import "./Free26.sol";
import "./Free27.sol";


pragma solidity ^0.8.23;


interface IFreeBase {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
  function transferOwnership(address newOwner) external;
  function createCollection(
    address minter,
    string calldata _namePrefix,
    string calldata _externalUrl,
    string calldata _imgUrl,
    string calldata _imgExtension,
    string calldata _description
  ) external;
}



contract FreeSeries3Deployer {
  address public steviep = 0x47144372eb383466D18FC91DB9Cd0396Aa6c87A4;
  IFreeBase public immutable free = IFreeBase(0x30b541f1182ef19c56a39634B2fdACa5a0F2A741);

  bool public deployed;

  address free21;
  address free22;
  address free23;
  address free24;
  address free25;
  address free26;
  address free27;

  constructor() {
    free21 = address(new Free21());
    free22 = address(new Free22());
    free23 = address(new Free23());
    free24 = address(new Free24());
    free25 = address(new Free25());
    free26 = address(new Free26());
    free27 = address(new Free27());

  }

  function reclaimFreeOwnership() public {
    require(msg.sender == steviep);
    free.transferOwnership(steviep);
  }

  function deploy() external {
    require(msg.sender == steviep);

    string memory url = 'https://steviep.xyz/free';
    string memory imrUrl = 'ipfs://.................................../';
    string memory extension = '.jpg';



    free.createCollection(free21, 'Free21 #', url, string(abi.encodePacked(imrUrl, '21')), extension, "Free of charge");
    free.createCollection(free22, 'Free22 #', url, string(abi.encodePacked(imrUrl, '22')), extension, "If it's free, you are the product");
    free.createCollection(free23, 'Free23 #', url, string(abi.encodePacked(imrUrl, '23')), extension, "Ladies drink free");
    free.createCollection(free24, 'Free24 #', url, string(abi.encodePacked(imrUrl, '24')), extension, "Free time");
    free.createCollection(free25, 'Free25 #', url, string(abi.encodePacked(imrUrl, '25')), extension, "Free Tibet");
    free.createCollection(free26, 'Free26 #', url, string(abi.encodePacked(imrUrl, '26')), extension, "Free Taiwan");
    free.createCollection(free27, 'Free27 #', url, string(abi.encodePacked(imrUrl, '27')), extension, "Free Palestine");

    reclaimFreeOwnership();
  }
}