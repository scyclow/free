
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
import "hardhat/console.sol";


interface ColdHardCash {
  function ownerOf(uint256) external view returns (address);
  function isRedeemed(uint256) external view returns (bool);
}

contract Free25 is FreeChecker {

  mapping(uint256 => address) public cashToMinter;

  ColdHardCash public cash = ColdHardCash(0x6DEa3f6f1bf5ce6606054BaabF5452726Fe4dEA1);

  function setMinter(uint256 cashTokenId, address minter) external {
    require(cash.ownerOf(cashTokenId) == msg.sender, 'Not owner of CASH token');
    require(cash.isRedeemed(cashTokenId), 'CASH token not redeemed');

    cashToMinter[cashTokenId] = minter;
  }

  function claim(uint256 free0TokenId, uint256 cashTokenId) external {
    preCheck(free0TokenId, '25');
    require(cashToMinter[cashTokenId] == msg.sender, 'Address cannot mint');
    postCheck(free0TokenId, 25, '25');
  }
}