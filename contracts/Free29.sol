
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


contract Free29 is FreeChecker {
  /*
  uint256 public constant WAIT_BLOCKS = 2900000

  mapping(uint256 => address) public free0TokenIdToOwner
  mapping(uint256 => address) public free0TokenIdToStakingBlock
  uint256 public minted


  on721Received() {
    require(this is a free token)
    require(this is a free0 token)

    preCheck(free0TokenId, '29');

    free0TokenIdToOwner[free0TokenId] = msg.sender
    free0TokenIdToStakingBlock[free0TokenId] = block.number
  }


  */

  function isContract(address account) internal view returns (bool) {
    uint256 size;
    assembly {
      size := extcodesize(account)
    }
    return size > 0;
  }

  function claim(uint256 free0TokenId) external {

    /*

    require(msg.sender == free0TokenIdToOwner[free0TokenId])
    require(block.number) > free0TokenIdToStakingBlock[free0TokenId]

    if (isContract(msg.sender)) {
      return free0
    }

    uint256 rnd = block.difficulty % 8
    uint256 threshold = mints % 16 < 8
      ? mints % 16
      : 16 - (mints % 16)


    mints    < this burns it
    0        0
    1        1
    2        2
    3        3
    4        4
    5        5
    6        6
    7        7
    8        8
    9        7
    10       6
    11       5
    12       4
    13       3
    14       2
    15       1
    16       0


    if (rnd < threshold) {
      free0TokenIdToStakingBlock[free0TokenId] += WAIT_BLOCKS
      return
    }

    return free0 to owner
    */


    postCheck(free0TokenId, 29, '29');

    //
  }

}