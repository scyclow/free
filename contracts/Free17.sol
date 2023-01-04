// SPDX-License-Identifier: CC0

pragma solidity ^0.8.17;

interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}


contract Free17 {
  IFree public immutable free;

  mapping(uint256 => bool) public free0TokenIdUsed;

  constructor(address freeAddr) {
    free = IFree(freeAddr);
  }

  function claim(uint256 free0TokenId) public {
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId], 'This Free0 has already been used to mint a Free17');
    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');

    require(addrIs0x123456789(msg.sender), 'Signer address must start with 0x123456789');

    free0TokenIdUsed[free0TokenId] = true;
    free.appendAttributeToToken(free0TokenId, 'Used For Free17 Mint', 'true');
    free.mint(17, msg.sender);
  }

  function addrIs0x123456789(address x) internal returns (bool) {
    for(uint i = 0; i < 5; i++) {
      bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
      uint8 hi = uint8(b) / 16;
      uint8 lo = uint8(b) - 16 * uint8(hi);

      if(
        hi != i * 2 + 1
        && (i == 4 ? true : lo == i * 2 + 2)
      ) return false;

    }
    return true;
  }


}
