// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}

contract Free1 {
  IFree free;

  uint public mintCount;
  mapping(uint256 => bool) public free0UsedForFree1Mint;

  constructor(address freeAddr) {
    free = IFree(freeAddr);
  }

  function claim(uint free0TokenId) public {
    require(mintCount < 1000, 'Cannot mint more than 1000');
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'You must use a Free0 as a mint pass');
    require(!free0UsedForFree1Mint[free0TokenId], 'Free0 already used to mint Free1');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0 token');

    free0UsedForFree1Mint[free0TokenId] = true;
    mintCount++;
    free.appendAttributeToToken(free0TokenId, 'Used For Free1 Mint', 'true');

    free.mint(1, msg.sender);
  }
}
