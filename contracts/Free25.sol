// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$        /$$$$$$  /$$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/       /$$__  $$| $$____/
| $$      | $$  \ $$| $$      | $$            |__/  \ $$| $$
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$           /$$$$$$/| $$$$$$$
| $$__/   | $$__  $$| $$__/   | $$__/          /$$____/ |_____  $$
| $$      | $$  \ $$| $$      | $$            | $$       /$$  \ $$
| $$      | $$  | $$| $$$$$$$$| $$$$$$$$      | $$$$$$$$|  $$$$$$/
|__/      |__/  |__/|________/|________/      |________/ \______/



 /$$
| $$
| $$$$$$$  /$$   /$$
| $$__  $$| $$  | $$
| $$  \ $$| $$  | $$
| $$  | $$| $$  | $$
| $$$$$$$/|  $$$$$$$
|_______/  \____  $$
           /$$  | $$
          |  $$$$$$/
           \______/
  /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$    /$$ /$$$$$$ /$$$$$$$$ /$$$$$$$
 /$$__  $$|__  $$__/| $$_____/| $$   | $$|_  $$_/| $$_____/| $$__  $$
| $$  \__/   | $$   | $$      | $$   | $$  | $$  | $$      | $$  \ $$
|  $$$$$$    | $$   | $$$$$   |  $$ / $$/  | $$  | $$$$$   | $$$$$$$/
 \____  $$   | $$   | $$__/    \  $$ $$/   | $$  | $$__/   | $$____/
 /$$  \ $$   | $$   | $$        \  $$$/    | $$  | $$      | $$
|  $$$$$$/   | $$   | $$$$$$$$   \  $/    /$$$$$$| $$$$$$$$| $$
 \______/    |__/   |________/    \_/    |______/|________/|__/


CC0 2023
*/


pragma solidity ^0.8.23;


import "./FreeChecker.sol";


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