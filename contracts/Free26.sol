// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$        /$$$$$$   /$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/       /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$      | $$            |__/  \ $$| $$  \__/
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$           /$$$$$$/| $$$$$$$
| $$__/   | $$__  $$| $$__/   | $$__/          /$$____/ | $$__  $$
| $$      | $$  \ $$| $$      | $$            | $$      | $$  \ $$
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


interface OffOn {
  function latestHash() external view returns (uint256);
  function lastTurnedOn() external view returns (uint256);
}


contract Free26 is FreeChecker {
  OffOn public offon = OffOn(0xA860D381A193A0811C77c8FCD881B3E9F245A419);
  uint256 lastMintTimestamp;

  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '26');

    require(offon.latestHash() > 0, 'Have you tried turning it on?');
    require(lastMintTimestamp < offon.lastTurnedOn(), 'Have you tried turning it off?');
    lastMintTimestamp = block.timestamp;

    postCheck(free0TokenId, 26, '26');
  }
}