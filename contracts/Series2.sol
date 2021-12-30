// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 seriesId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToSeriesId(uint256 tokenId) external returns (uint256 seriesId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}

// 0x4f857a92269dc9b42edb7fab491679decb46e848
interface INVCMinter {
  function usedIOUs(uint256 iouId) external returns (bool used);
}

interface IIOU {
  function ownerOf(uint256 tokenId) external returns (address owner);
}

interface ISeries1 {
  function series0UsedForSeries1Mint(uint256 tokenId) external returns (bool used);
}

contract Series2 {
  IFree free;
  ISeries1 series1Contract;
  INVCMinter nvcMinter;
  IIOU iouContract;

  mapping (uint256 => bool) public usedIOUs;
  mapping(uint256 => bool) public series0UsedForSeries2Mint;

  constructor(address freeAddr, address series1Addr, address iouAddr, address nvcMinterAddr) {
    free = IFree(freeAddr);
    series1Contract = ISeries1(series1Addr);
    nvcMinter = INVCMinter(nvcMinterAddr);
    iouContract = IIOU(iouAddr);
  }

  function claim(uint256 iouId, uint256 free0TokenId) public {
    require(iouContract.ownerOf(iouId) == msg.sender, "You must be the owner of this IOU");
    require(nvcMinter.usedIOUs(iouId), 'This IOU was not used to mint a NVC');
    require(!usedIOUs[iouId], 'This IOU has already minted a FREE');

    require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0 token');
    require(
      free.tokenIdToSeriesId(free0TokenId) == 0
      && series1Contract.series0UsedForSeries1Mint(free0TokenId) == true,
      'You must use a Free0 that has already been used to mint a Free1 as a mint pass'
    );
    require(!series0UsedForSeries2Mint[free0TokenId], 'Free0 already used to mint Free2');
    free.appendAttributeToToken(free0TokenId, 'Used For Free2 Mint', 'true');


    usedIOUs[iouId] = true;
    series0UsedForSeries2Mint[free0TokenId] = true;

    free.mint(2, msg.sender);
  }
}





