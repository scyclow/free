// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 collectionId, address to) external;
}

contract Free0 {
  IFree free;

  constructor(address freeAddr) {
    free = IFree(freeAddr);
  }

  function claim() public {
    free.mint(0, msg.sender);
  }
}

