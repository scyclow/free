// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}

contract Free4 {
  IFree free;
  address minter;
  address target;

  mapping(uint256 => bool) public free0UsedForFree4Mint;

  constructor(address freeAddr, address minterAddr, address targetAddr) {
    free = IFree(freeAddr);
    minter = minterAddr;
    target = targetAddr;
  }

  function claim(uint256 free0TokenId) public {
    require(msg.sender == minter, 'Only the minter can mint');

    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'You must use a Free0 as a mint pass');
    require(!free0UsedForFree4Mint[free0TokenId], 'Free0 already used to mint Free4');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0 token');

    free0UsedForFree4Mint[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId, 'Used For Free4 Mint', 'true');
    free.mint(4, target);
  }
}

