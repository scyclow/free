
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


contract Free32 is FreeChecker {
  /*



  */

  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '32');

    /*
      uint256 senderFreeBalance =
      uint256 totalFreeBalance =

      require(
        free.balanceOf(msg.sender)
        >= free.totalSupply() / 100
      )




    */



    postCheck(free0TokenId, 32, '32');
  }

}