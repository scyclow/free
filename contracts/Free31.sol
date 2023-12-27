
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


contract Free31 is FreeChecker {
  /*
  mapping(address => uint8) public continuousCheckins
  mapping(address => uint256) public lastCheckinTime

  function checkin() {
    if (
      block.timestamp > lastCheckinTime[msg.sender] + 24 hours
      && block.timestamp < lastCheckinTime[msg.sender] + 25 hours
      && continuousCheckins[msg.sender] < 31
    ) {
      continuousCheckins[msg.sender] += 1
    } else {
      continuousCheckins[msg.sender] = 1
    }

    lastCheckinTime[msg.sender] = block.timestamp


  }


  */

  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '31');

    /*
      require(continuousCheckins[msg.sender] == 31)
      require(
        block.timestamp > lastCheckinTime[msg.sender]
        && block.timestamp < lastCheckinTime[msg.sender] + 1
      )
      continuousCheckins[msg.sender] = 0
      lastCheckinTime[msg.sender] = 0



    */



    postCheck(free0TokenId, 31, '31');
  }

}