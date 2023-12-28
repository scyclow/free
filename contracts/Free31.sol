
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
  mapping(address => uint8) public continuousCheckins;
  mapping(address => uint256) public lastCheckinTime;
  mapping(address => uint256) public activeFree0TokenId;

  function checkIn(uint256 free0TokenId) external {
    if (
      block.timestamp > lastCheckinTime[msg.sender] + 24 hours
      && block.timestamp < lastCheckinTime[msg.sender] + 25 hours
      && continuousCheckins[msg.sender] < 31
      && activeFree0TokenId[msg.sender] == free0TokenId
    ) {
      continuousCheckins[msg.sender] += 1;
    } else {
      continuousCheckins[msg.sender] = 1;
    }

    activeFree0TokenId[msg.sender] = free0TokenId;
    lastCheckinTime[msg.sender] = block.timestamp;
  }




  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '31');


    require(continuousCheckins[msg.sender] == 31, 'Must have 31 days of continuous checkins');
    require(
      block.timestamp > lastCheckinTime[msg.sender]
      && block.timestamp < lastCheckinTime[msg.sender] + 24 hours,
      'Must claim within 1 hour of last checkin'
    );

    continuousCheckins[msg.sender] = 0;
    lastCheckinTime[msg.sender] = 0;

    postCheck(free0TokenId, 31, '31');
  }

}