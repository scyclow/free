
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

interface DancingMan {
  function balanceOf(address, uint256) external returns (uint256);
  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) external;
}

contract Free23 is FreeChecker {
  DancingMan public dancingMan = DancingMan(0xC8D1a7814194aa6355727098448C7EE48f2a1e1C);

  uint256 public totalDancingMen;
  mapping(address => uint256) public ownerToStakedDancingMen;
  mapping(uint256 => bool) public free22Used;

  function onERC1155Received(
    address,
    address from,
    uint256 id,
    uint256 amount,
    bytes calldata
  ) external returns (bytes4) {
    require(
      msg.sender == address(dancingMan) && id == 1,
      'Token must be Dancing Man'
    );

    ownerToStakedDancingMen[from] += amount;

    return this.onERC1155Received.selector;
  }

  function withdrawDancingMan(uint256 amount) external {
    require(amount <= ownerToStakedDancingMen[msg.sender], 'Dancing Man withdrawl too large');
    ownerToStakedDancingMen[msg.sender] -= amount;
    dancingMan.safeTransferFrom(address(this), msg.sender, 1, amount, '');
  }


  function claim(uint256 free0TokenId, uint256 free22TokenId) external {
    preCheck(free0TokenId, '23');

    require(dancingMan.balanceOf(address(this), 1) >= 5, 'Dancin Man balance not >= 5');
    checkFreeToken(free22TokenId, 22);
    require(!free22Used[free22TokenId], 'Free22 already used');
    free22Used[free22TokenId] = true;


    postCheck(free0TokenId, 23, '23');
  }

}