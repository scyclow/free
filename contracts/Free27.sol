
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


contract Free27 is FreeChecker {
  /*
  mapping(uint256 => bool) public vassalIdUsed


  */

  function claim(uint256 free0TokenId, uint256 fiefdomVassalId) external {
    preCheck(free0TokenId, '27');

    /*
    Fiefdom f = Fiefdom(fiefdoms.tokenIdToFiefdom)
    require(f.ownerOf(0) == msg.sender)
    require(!vassalidUsed[fiefdomVassalId])

    vassalIdUsed[fiefdomVassalId] = true


    */



    postCheck(free0TokenId, 27, '27');
  }

}