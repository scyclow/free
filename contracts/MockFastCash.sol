// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;


contract MockFastCash {
  mapping(address => uint256) public balanceOf;

  function __setBalance(address owner, uint256 balance) public {
    balanceOf[owner] = balance;
  }
}
