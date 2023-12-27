
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


contract Free26 is FreeChecker {
  /*
  uint256 lastMintTimestamp;


  */

  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '26');

    /*
    require(OffOn.latestHash > 0)
    require(lastMintTimestamp != OffOn.lastTurnedOn)
    lastMintTimestamp = block.timestamp


    */



    postCheck(free0TokenId, 26, '26');
  }

}