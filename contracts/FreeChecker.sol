
// SPDX-License-Identifier: CC0


/*
CC0 2023
*/


pragma solidity ^0.8.23;

interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
  function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

abstract contract FreeChecker {
  mapping(uint256 => bool) public free0TokenIdUsed;
  IFree public immutable free = IFree(0x30b541f1182ef19c56a39634B2fdACa5a0F2A741);

  function preCheck(uint256 free0TokenId, string memory freeStr) internal {
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId],
      string(abi.encodePacked('This Free0 has already been used to mint a Free', freeStr))
    );
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');

  }

  function postCheck(uint256 free0TokenId, uint256 freeNumber, string memory freeStr) internal {
    free0TokenIdUsed[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId,
      string(abi.encodePacked('Used For Free', freeStr, ' Mint')),
      'true'
    );
    free.mint(freeNumber, msg.sender);
  }

  function checkFreeToken(uint256 freeTokenId, uint256 collectionId) internal {
    require(free.ownerOf(freeTokenId) == msg.sender, 'Not owner of token');
    require(free.tokenIdToCollectionId(freeTokenId) == collectionId, 'Token collection mismatch');
  }
}