// SPDX-License-Identifier: CC0

pragma solidity ^0.8.17;
 
interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}


contract Free14 {
  IFree public immutable free;
  address public terminallyOnlineMultisig;

  uint256 public claimableTokensLeft;

  mapping(uint256 => bool) public free0TokenIdUsed;

  constructor(address freeAddr, address toMultisigAddr, address editionsAddr) {
    free = IFree(freeAddr);
    terminallyOnlineMultisig = toMultisigAddr;
  }

  function incrementClaimableTokens(uint256 increment) external {
    require(msg.sender == terminallyOnlineMultisig, 'Can only be called by TO multisig');
    claimableTokensLeft += increment;
  }

  function claim(uint256 free0TokenId) public {
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId], 'This Free0 has already been used to mint a Free14');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');

    require(claimableTokensLeft >= 0, 'No tokens left to claim');
    claimableTokensLeft -= 1;


    free0TokenIdUsed[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId, 'Used For Free14 Mint', 'true');
    free.mint(14, msg.sender);
  }
}

