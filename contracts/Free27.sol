
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


interface Fiefdoms {
  function tokenIdToFiefdom(uint256) external view returns (address);
}

interface FiefdomsVassal {
  function ownerOf(uint256) external view returns (address);
}


contract Free27 is FreeChecker {

  Fiefdoms public fiefdoms = Fiefdoms(0x9304D9116Bb83ccedCc33ac4918Adb9b1E104230);
  mapping(uint256 => bool) public vassalIdUsed;


  function claim(uint256 free0TokenId, uint256 fiefdomVassalId) external {
    preCheck(free0TokenId, '27');

    FiefdomsVassal vassal = FiefdomsVassal(fiefdoms.tokenIdToFiefdom(fiefdomVassalId));

    require(vassal.ownerOf(0) == msg.sender, 'You do not lord over this vassal');
    require(!vassalIdUsed[fiefdomVassalId], 'Token already used');
    vassalIdUsed[fiefdomVassalId] = true;


    postCheck(free0TokenId, 27, '27');
  }

}