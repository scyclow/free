
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


contract Free25 is FreeChecker {
  /*
  mapping(uint256 => address) public cashToMinter

  function setMinter(uint256 cashTokenId, address minter) external {
    require(msg.sender owns cash token)
    require(cash token is redeemed)

    cashToMinter[cashTokenId] = minter
  }


  */

  function claim(uint256 free0TokenId, uint256 cashTokenId) external {
    preCheck(free0TokenId, '25');

    /*

    require(cashToMinter[cashTokenId] == msg.sender)

    */



    postCheck(free0TokenId, 25, '25');
  }

}