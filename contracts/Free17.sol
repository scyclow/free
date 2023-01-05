// SPDX-License-Identifier: CC0

pragma solidity ^0.8.17;

interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}

interface ISubwayJesusPamphlets {
  function ownerOf(uint256 id) external returns (address);
}


contract Free17 {
  IFree public immutable free;
  ISubwayJesusPamphlets public immutable subwayJesusPamphlets;
  mapping(uint256 => bool) public free0TokenIdUsed;
  mapping(uint256 => uint256) public sjpBlessings;
  mapping(uint256 => uint256) public blessingsReceived;
  mapping(bytes32 => bool) public blessings;

  constructor(address freeAddr, address sjpAddr) {
    free = IFree(freeAddr);
    subwayJesusPamphlets = ISubwayJesusPamphlets(sjpAddr);
  }

  function hashBlessing(uint256 sjpTokenId, uint256 free0TokenId) public view returns (bytes32) {
    return keccak256(abi.encodePacked(sjpTokenId, free0TokenId));
  }

  function bless(uint256 sjpTokenId, uint256 free0TokenId) external {
    require(subwayJesusPamphlets.ownerOf(sjpTokenId) == msg.sender, 'You must own this Pamphlet');
    require(sjpBlessings[sjpTokenId] < 5, 'This pamphlet has blessed too many times');
    bytes32 hashedBlessing = hashBlessing(sjpTokenId, free0TokenId);
    require(!blessings[hashedBlessing], 'This pamphlet has already blessed this token');

    blessings[hashedBlessing] = true;
    sjpBlessings[sjpTokenId] += 1;
    blessingsReceived[free0TokenId] += 1;
  }


  function claim(uint256 free0TokenId) external {
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId], 'This Free0 has already been used to mint a Free17');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');

    require(blessingsReceived[free0TokenId] >= 3, 'Free0 must have at least 3 blessings');

    free0TokenIdUsed[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId, 'Used For Free17 Mint', 'true');
    free.mint(17, msg.sender);
  }
}