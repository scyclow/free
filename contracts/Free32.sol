// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$        /$$$$$$   /$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/       /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$      | $$            |__/  \ $$|__/  \ $$
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$            /$$$$$/  /$$$$$$/
| $$__/   | $$__  $$| $$__/   | $$__/           |___  $$ /$$____/
| $$      | $$  \ $$| $$      | $$             /$$  \ $$| $$
| $$      | $$  | $$| $$$$$$$$| $$$$$$$$      |  $$$$$$/| $$$$$$$$
|__/      |__/  |__/|________/|________/       \______/ |________/



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
}

interface Free19 {
  function claimer() external view returns (address);
}

interface IFree30 {
  function free30Claimer() external view returns (address);
}

interface FastCashMoneyPlus {
  function balanceOf(address owner) external view returns (uint256 balance);
}

contract Free32 is FreeChecker {
  OffOn public offon = OffOn(0xA860D381A193A0811C77c8FCD881B3E9F245A419);
  Free19 public free19 = Free19(0xaBCeF3a4aDC27A6c962b4fC17181F47E62244EF0);
  FastCashMoneyPlus public fastcash = FastCashMoneyPlus(0xcA5228D1fe52D22db85E02CA305cddD9E573D752);


  function percentBpsRequired() public view returns (uint256) {
    bool turnedOff = offon.latestHash() == 0;
    uint256 free3Supply = free.collectionSupply(3);
    uint256 free20Supply = free.collectionSupply(20);
    address free30Addr = free.collectionIdToMinter(30);
    address free30Claimer = IFree30(free30Addr).free30Claimer();

    uint256 free20Bps = free20Supply * 8;

    uint256 free3NegBps = free3Supply > free20Bps + 50
      ? free20Bps + 50
      : free3Supply;

    return 50
      + (turnedOff ? 0 : 50)
      + (free19.claimer() == address(this) ? 0 : 25)
      + (free30Claimer == address(this) ? 0 : 25)
      + (fastcash.balanceOf(0x56FF4F826795f2dE13A89F60ea7B1cF14c714252) / 15 ether)
      + free20Bps
      - free3NegBps;
  }

  function freesRequired() public view returns (uint256) {
    uint256 totalFreeSupply = free.totalSupply();
    return totalFreeSupply * percentBpsRequired() / 10000;
  }

  function claim(uint256 free0TokenId) external {
    preCheck(free0TokenId, '32');

    uint256 senderFreeBalance = free.balanceOf(msg.sender);

    require(senderFreeBalance >= freesRequired());

    postCheck(free0TokenId, 32, '32');
  }

}