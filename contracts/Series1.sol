// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 seriesId, address to) external;
  function tokenIdToSeriesId(uint256 tokenId) external returns (uint256 seriesId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}

contract Series1 {
  IFree free;

  uint public mintCount;
  mapping(uint256 => bool) public series0UsedForSeries1Mint;

  constructor() {
    free = IFree(address(0));
  }

  function claim(uint free0TokenId) public {
    require(mintCount < 1000, 'Cannot mint more than 1000');
    require(free.tokenIdToSeriesId(free0TokenId) == 0, 'You must use a Free0 as a mint pass');
    require(!series0UsedForSeries1Mint[free0TokenId], 'Free0 already used to mint Free1');

    series0UsedForSeries1Mint[free0TokenId] = true;
    mintCount++;
    free.appendAttributeToToken(free0TokenId, 'Used For Free1 Mint', 'true');

    free.mint(1, msg.sender);
  }
}
