
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


contract Free33 is FreeChecker {
  mapping(uint256 => bool) public THREE_BALLS;

  constructor() {
    THREE_BALLS[12] = true;
    THREE_BALLS[30] = true;
    THREE_BALLS[36] = true;
    THREE_BALLS[37] = true;
    THREE_BALLS[38] = true;
    THREE_BALLS[39] = true;
    THREE_BALLS[40] = true;
    THREE_BALLS[42] = true;
    THREE_BALLS[46] = true;
    THREE_BALLS[52] = true;
    THREE_BALLS[54] = true;
    THREE_BALLS[56] = true;
    THREE_BALLS[57] = true;
    THREE_BALLS[58] = true;
    THREE_BALLS[59] = true;
    THREE_BALLS[60] = true;
    THREE_BALLS[64] = true;
    THREE_BALLS[65] = true;
    THREE_BALLS[66] = true;
    THREE_BALLS[69] = true;
    THREE_BALLS[70] = true;
    THREE_BALLS[72] = true;
    THREE_BALLS[77] = true;
    THREE_BALLS[79] = true;
    THREE_BALLS[80] = true;
    THREE_BALLS[81] = true;
    THREE_BALLS[86] = true;
    THREE_BALLS[87] = true;
    THREE_BALLS[90] = true;
    THREE_BALLS[91] = true;
    THREE_BALLS[94] = true;
    THREE_BALLS[95] = true;
    THREE_BALLS[98] = true;
    THREE_BALLS[99] = true;
    THREE_BALLS[101] = true;
    THREE_BALLS[102] = true;
  }
  /*

  mapping(uint256 => uint256) public ballX
  mapping(uint256 => uint256) public ballY
  mapping(uint256 => bool) public ballThrown


  function throwBall(uint256 grailsVTokenId) external {
    require(grailsV.ownerOf(grailsVTokenId) == msg.sender)
    require(THREE_BALLS[grailsVTokenId])

    ballX[grailsVTokenId] = block.difficulty % 6;
    ballY[grailsVTokenId] = (block.difficulty / 100) % 6;
    ballThrown[grailsVTokenId] = true

  }



  function isLine(
    uint256 ball_a,
    uint256 ball_b,
    uint256 ball_c
  ) external view returns (bool) {
    int8 a_b_YDiff = int8(ballY[ball_b]) - int(ballY[ball_a])
    int8 a_c_YDiff = int8(int(ballY[ball_c] - ballY[ball_c]))

    if (a_b_YDiff == 0 && a_c_YDiff == 0) return true
    if (
      a_b_YDiff == 0 && a_c_YDiff != 0 ||
      a_b_YDiff != 0 && a_c_YDiff == 0
    ) return false

    int8 a_b_XDiff = int8(ballX[ball_b]) - int(ballX[ball_a])
    int8 a_c_XDiff = int8(int(ballX[ball_c] - ballX[ball_a]))

    int8 a_b_ratio = (a_b_XDiff * 60) / a_b_YDiff
    int8 a_c_ratio = (a_c_XDiff * 60) / a_c_YDiff

    return (
      a_b_ratio == a_c_ratio
      || a_b_ratio == a_c_ratio * -1
    )

  }

  */


  function claim(
    uint256 free0TokenId,
    uint256 ownedBallTokenId,
    uint256 supportingBallTokenId1,
    uint256 supportingBallTokenId2
  ) external {
    preCheck(free0TokenId, '33');

    /*

    require(grailsV.ownerOf(ownedBallTokenId) == msg.sender)
    require(ballThrown[ownedBallTokenId])
    require(ballThrown[supportingBallTokenId1])
    require(ballThrown[supportingBallTokenId2])


    require(
      ownedBallTokenId != supportingBallTokenId1 &&
      ownedBallTokenId != supportingBallTokenId2 &&
      supportingBallTokenId1 != supportingBallTokenId2
    )



    require(isLine(ownedBallTokenId, supportingBallTokenId1, supportingBallTokenId2))

    ballThrown[ownedBallTokenId] = false


    */



    postCheck(free0TokenId, 33, '33');
  }

}