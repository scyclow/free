// SPDX-License-Identifier: CC0

pragma solidity ^0.8.17;

interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}


contract Free16 {
  IFree public immutable free;
  uint256 public constant jan4_2023 = 1672808400;

  mapping(uint256 => bool) public free0TokenIdUsed;

  constructor(address freeAddr) {
    free = IFree(freeAddr);
  }


  function claim(uint256 free0TokenId) public {
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId], 'This Free0 has already been used to mint a Free16');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');

    require(
      ((block.timestamp - jan4_2023) / 1 days) % 7 == 0,
      'Can only be claimed on a Wednesday'
    ); // TODO not sure if this works

    require(block.basefee <= 5, 'Base fee must be 5gwei or less'); // TODO is this gwei or wei?


    free0TokenIdUsed[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId, 'Used For Free16 Mint', 'true');
    free.mint(16, msg.sender);
  }
}
