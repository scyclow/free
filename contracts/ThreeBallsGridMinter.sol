// SPDX-License-Identifier: CC0


/*
████████ ██   ██ ██████  ███████ ███████
   ██    ██   ██ ██   ██ ██      ██
   ██    ███████ ██████  █████   █████
   ██    ██   ██ ██   ██ ██      ██
   ██    ██   ██ ██   ██ ███████ ███████


██████   █████  ██      ██      ███████
██   ██ ██   ██ ██      ██      ██
██████  ███████ ██      ██      ███████
██   ██ ██   ██ ██      ██           ██
██████  ██   ██ ███████ ███████ ███████


 ██████  ██████  ██ ██████
██       ██   ██ ██ ██   ██
██   ███ ██████  ██ ██   ██
██    ██ ██   ██ ██ ██   ██
 ██████  ██   ██ ██ ██████



CC0 2023 - steviep.eth
*/


import "./ThreeBallsGrid.sol";


pragma solidity ^0.8.23;

interface IFree19 {
  function lastAssigned() external view returns (uint256);
  function claimer() external view returns (address);
}

contract ThreeBallsGridMinter {
  IFree19 public free19 = IFree19(0xaBCeF3a4aDC27A6c962b4fC17181F47E62244EF0);
  address public baseContract;
  mapping(address => uint256) public minterToTimestamp;


  constructor() {
    baseContract = msg.sender;
  }

  function mint() external {
    require(free19.claimer() == msg.sender, 'Must be Free19 contract claimer');
    require(free19.lastAssigned() + 30 minutes < block.timestamp, 'Must be Free19 contract claimer for > 30 minutes');
    require(minterToTimestamp[msg.sender] + 15 minutes < block.timestamp, 'Must wait at least 15 minutes between mints');

    minterToTimestamp[msg.sender] = block.timestamp;
    ThreeBallsGrid(baseContract).mint(msg.sender);
  }
}