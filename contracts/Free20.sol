// SPDX-License-Identifier: CC0

pragma solidity ^0.8.17;

interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
  function totalSupply() external view returns (uint256);
}


contract Free20 {
  IFree public immutable free;

  mapping(uint256 => bool) public free0TokenIdUsed;

  constructor(address freeAddr) {
    free = IFree(freeAddr);
  }

  function claim(uint256 free0TokenId) public {
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId], 'This Free0 has already been used to mint a Free20');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');

    require((free.totalSupply() / 100) % 2 == 0, 'Invalid total Free count');
    require((block.number/ 100) % 2 == 0, 'Invalid block number');

    free0TokenIdUsed[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId, 'Used For Free20 Mint', 'true');
    free.mint(20, msg.sender);
  }
}
