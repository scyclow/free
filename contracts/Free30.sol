// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$        /$$$$$$   /$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/       /$$__  $$ /$$$_  $$
| $$      | $$  \ $$| $$      | $$            |__/  \ $$| $$$$\ $$
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$            /$$$$$/| $$ $$ $$
| $$__/   | $$__  $$| $$__/   | $$__/           |___  $$| $$\ $$$$
| $$      | $$  \ $$| $$      | $$             /$$  \ $$| $$ \ $$$
| $$      | $$  | $$| $$$$$$$$| $$$$$$$$      |  $$$$$$/|  $$$$$$/
|__/      |__/  |__/|________/|________/       \______/  \______/



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

interface Free19 {
  function lastAssigned() external view returns (uint256);
  function claimer() external view returns (address);
}


contract Free30 is FreeChecker {
  Free19 public free19 = Free19(0xaBCeF3a4aDC27A6c962b4fC17181F47E62244EF0);

  address public free30Claimer;
  uint256 public free30ClaimerLastAssigned;

  mapping(uint256 => bool) public free19TokenIdUsed;
  mapping(uint256 => address) public free19ToClaimer;
  mapping(uint256 => uint256) public free19ToClaimerLastAssigned;

  function _checkFree19Token(uint256 free19TokenId) internal {
    checkFreeToken(free19TokenId, 19);
    require(!free19TokenIdUsed[free19TokenId], 'Free19 already used');
  }

  function _checkFree19ContractClaimer() internal view {
    require(free19.claimer() == msg.sender, 'Must be Free19 contract claimer');
    require(free19.lastAssigned() + 30 hours < block.timestamp, 'Must be Free19 contract claimer for > 30 hours');
  }

  function _checkFree19TokenClaimer(uint256 free19TokenId) internal view {
    require(free19ToClaimer[free19TokenId] == msg.sender, 'Must be Free19 token claimer');
    require(free19ToClaimerLastAssigned[free19TokenId] + 30 hours < block.timestamp, 'Must be Free19 token claimer for > 30 hours');
  }


  function free19TokenAssign(uint256 free19TokenId, address claimer) external {
    _checkFree19Token(free19TokenId);
    _checkFree19ContractClaimer();

    require(free19.claimer() != claimer, 'Free19 token claimer cannot be set to Free19 contract claimer');


    free19ToClaimer[free19TokenId] = claimer;
    free19ToClaimerLastAssigned[free19TokenId] = block.timestamp;
  }


  function assign(uint256 free19TokenId, address claimer) public {
    _checkFree19Token(free19TokenId);
    _checkFree19TokenClaimer(free19TokenId);
    _checkFree19ContractClaimer();

    require(free19ToClaimer[free19TokenId] != claimer, 'Free30 claimer cannot be set to Free19 token claimer');

    free30Claimer = claimer;
    free30ClaimerLastAssigned = block.timestamp;
  }


  function claim(uint256 free0TokenId, uint256 free19TokenId) external {
    preCheck(free0TokenId, '30');

    _checkFree19Token(free19TokenId);

    require(free30Claimer == msg.sender);
    require(free30ClaimerLastAssigned + 30 hours < block.timestamp, 'Must be Free30 claimer for > 30 hours');

    _checkFree19TokenClaimer(free19TokenId);
    _checkFree19ContractClaimer();



    free19TokenIdUsed[free19TokenId] = true;


    postCheck(free0TokenId, 30, '30');
  }

}