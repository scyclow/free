
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




contract Free21 is FreeChecker {

  /*


  address originalOwner_a
  uint256 tokenId_a
  uint256 revealedTimestamp_a
  uint256 stakedTimestamp_a
  uint256 revealedSecretNumber_a
  bytes hashedSecretNumber_a

  address originalOwner_b
  uint256 tokenId_b
  uint256 revealedTimestamp_b
  uint256 stakedTimestamp_b
  uint256 revealedSecretNumber_b
  bytes hashedSecretNumber_b



  function stake_a(uint256 free0TokenId, bytes hashedNumber) external {
    preCheck(free0TokenId, '21');
    require(originalOwner_a == address(0))

    // check that token was used for 8-20
    // transfer free0TokenId to this contract

    tokenId_a = freeTokenId;
    hashedSecretNumber_a = hashedNumber;
    originalOwner_a = msg.sender
  }

  function stake_b(uint256 free0TokenId, bytes hashedNumber) external {
    preCheck(free0TokenId, '21');
    require(originalOwner_b == address(0))

    // check that token was used for 8-20
    // transfer free0TokenId to this contract

    tokenId_b = freeTokenId;
    hashedSecretNumber_b = hashedNumber;
    originalOwner_b = msg.sender
  }


  function withdraw_a() external {
    require(originalOwner_a == msg.sender)
    require(revealedTimestamp_b == 0)

    // return free0

    _clearVars_a()
  }

  function withdraw_b() external {
    require(originalOwner_b == msg.sender)
    require(revealedTimestamp_a == 0)

    // return free0

    _clearVars_b()
  }


  function reveal_a(uint256 revealedNumber) external {
    require(keccak256(revealedNumber) == hashedSecretNumber_a)
    revealedSecretNumber_a = revealedNumber
    revealedTimestamp_a = block.timestamp;
  }

  function reveal_b(uint256 revealedNumber) external {
    require(keccak256(revealedNumber) == hashedSecretNumber_b)
    revealedSecretNumber_b = revealedNumber
    revealedTimestamp_b = block.timestamp;
  }

  function unclog(uint256 free0TokenId) {
    // require msg.sender owns this token
    // check that token was used for 8-20

    require(
      revealedTimestamp_a > 0 &&
      revealedTimestamp_b > 0 &&
      revealedSecretNumber_a % 2 == 1 &&
      revealedSecretNumber_b % 2 == 1
    )

    // transfer both frees to msg.sender

    _clearVars_a()
    _clearVars_b()
  }



  fucntion _clearVars_a() internal {
    originalOwner_a = address(0)
    tokenId_a = 0
    revealedTimestamp_a = 0
    stakedTimestamp_a = 0
    revealedSecretNumber_a = 0
    hashedSecretNumber_a = bytes(0)
  }


  fucntion _clearVars_b() internal {
    originalOwner_b = address(0)
    tokenId_b = 0
    revealedTimestamp_b = 0
    stakedTimestamp_b = 0
    revealedSecretNumber_b = 0
    hashedSecretNumber_b = bytes(0)
  }




  function claim() external {

    // if either  original address is a contract, return tokens and don't mint free0


    if (revealedTimestamp_a == 0 && revealedTimestamp_b == 0) {
      if (
        block.timestamp - stakedTimestamp_a > 7 days &&
        block.timestamp - stakedTimestamp_b > 7 days
      ) {
        // return 0s
        _clearVars_a()
        _clearVars_b()
        return;
      } else {
        throw error
      }
    }

    if (revealedTimestamp_a > 0 && revealedTimestamp_b == 0) {
      if (block.timestamp - revealedTimestamp_a > 7 days) {
        // A gets both free0 tokens
        postCheck(free0TokenId_a, 21, '21');
        _clearVars_a()
        _clearVars_b()
        return;
      } else {
        error
      }
    }


    if (revealedTimestamp_b > 0 && revealedTimestamp_a == 0) {
      if (block.timestamp - revealedTimestamp_b > 7 days) {
        // B gets both free0 tokens
        postCheck(free0TokenId_b, 21, '21');
        _clearVars_a()
        _clearVars_b()
        return;
      } else {
        error
      }
    }

    const aDefects = revealedSecretNumber_a % 2 == 1
    const bDefects = revealedSecretNumber_b % 2 == 1

    if (aDefects && !bDefects) {
      // A gets both free0 tokens
      postCheck(free0TokenId_a, 21, '21');

    } else if (bDefects && !aDefects) {
      // B gets both free0 tokens
      postCheck(free0TokenId_b, 21, '21');

    } else if (aDefects && bDefects) {
      // something bad happens to both frees

      return;

    } else {
      // return frees
      postCheck(free0TokenId_a, 21, '21');
      postCheck(free0TokenId_b, 21, '21');
    }
    _clearVars_a()
    _clearVars_b()
  }



  */


}