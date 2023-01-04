// SPDX-License-Identifier: CC0

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}

contract LowercaseMockFree {
  IFree public immutable free;

  uint public freeNumber;
  mapping(uint256 => bool) public free0tokenIdUsed;

  constructor(address freeAddr, uint256 _freeNumber) {
    free = IFree(freeAddr);
    freeNumber = _freeNumber;
  }

  function claim(uint free0TokenId) public {
    free0tokenIdUsed[free0TokenId] = true;
    free.mint(freeNumber, msg.sender);
  }
}
