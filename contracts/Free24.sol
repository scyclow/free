
// SPDX-License-Identifier: CC0


/*
TODO
TODO
TODO
TODO
TODO
TODO
TODO
TODO

CC0 2023
*/


pragma solidity ^0.8.23;


import "./FreeChecker.sol";


contract Free24 is FreeChecker {
  /*
  uint256 public deployTime

  constructor() {
    deployTime = block.timestamp
  }

  function mintDay(uint256 timestamp) public view returns (bool) {
    uint256 timeDiffDays = (timestamp - deployTime) / 1 days
    return timeDiffDays % 350 == 0

  }


  */

  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '24');

    /*

    require(mintDay(block.timestamp))

    */



    postCheck(free0TokenId, 24, '24');
  }

}