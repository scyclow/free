
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


contract Free30 is FreeChecker {
  /*

  mapping(uint256 => address) public free19ToClaimer
  mapping(uint256 => uint256) public free19ToClaimerLastAssigned

  uint256 public lastAssigned;
  address public claimer;

  function assign(address asignee) public {


    require(msg.sender == 0x666eBFf14e0ADB8F1924dFd93ded3193E3296543)
    require(msg.sender == free19.claimer)
    require(free19.lastAssigned + 30 hours < block.timestamp)



    claimer = asignee;
    lastAssigned = block.timestamp;
  }

  function setFree19Claimer(uint256 free19TokenId, address claimer) external {
    checkFreeToken(free19TokenId, 19)
    free19ToClaimer[free19TokenId] = claimer
    free19ToClaimerLastAssigned[free19TokenId] = block.timestamp
  }


  */

  function claim(uint256 free0TokenId, uint256 free19TokenId) external {
    preCheck(free0TokenId, '30');

    /*

    require(claimer == msg.sender)
    require(lastAssigned + 30 hours < block.timestamp)

    require(free19ToClaimer[free19TokenId] == msg.sender)
    require(free19ToClaimerLastAssigned[free19TokenId] >= 30 hours)

    require(free19.claimer == msg.sender)
    require(free19.lastAssigned + 30 hours < block.timestamp)





    */



    postCheck(free0TokenId, 30, '30');
  }

}