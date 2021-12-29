// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 seriesId, address to) external;
}

contract Series0 {
  IFree free;

  // uint public topMintCount;
  // address public topMinter;
  // mapping(address => uint256) mintCount;

  constructor(address freeAddr) {
    free = IFree(freeAddr);
  }

  function claim() public {
    // mintCount[msg.sender] += 1;

    // if (mintCount[msg.sender] > topMintCount) {
    //   topMintCount = mintCount[msg.sender];
    //   topMinter = msg.sender;
    // }

    free.mint(0, msg.sender);
  }
}

