
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


contract Free28 is FreeChecker {
  /*
  mapping(uint256 => bool) public mmoProposerTokenIdUsed
  mapping(uint256 => bool) public mmoProp15VoterTokenIdUsed
  mapping(uint256 => bool) public mmoActiveTokenIdUsed
  mapping(uint256 => bool) public prop15WhitePaperTokenIdUsed


  */

  function claim(
    uint256 free0TokenId,
    uint256 mmoProposerTokenId,
    uint256 mmoProp15VoterTokenId,
    uint256 mmoActiveTokenId,
    uint256 prop15WhitePaperTokenId
  ) external {
    preCheck(free0TokenId, '28');

    /*
    require(mmo.ownerOf(mmoProposerTokenId) == msg.sender)
    require(mmo.ownerOf(mmoActiveTokenId) == msg.sender)
    require(mmo.ownerOf(mmoProp15VoterTokenId) == msg.sender)
    require(prop15.ownerOf(prop15WhitePaperTokenId) == msg.sender)


    require(!mmoProposerTokenIdUsed[mmoProposerTokenId])
    require(!mmoActiveTokenIdUsed[mmoActiveTokenId])
    require(!mmoProp15VoterTokenIdUsed[mmoProp15VoterTokenId])
    require(!prop15WhitePaperTokenIdUsed[prop15WhitePaperTokenId])


    require(mmo.calculateVotes(mmo.tokenIdToWeek(mmoProposerTokenId)) >= 10)
    require(mmo.settlementAddressProposals(mmoProposerTokenId) != 0x0)

    require(
      mmo.votes(mmoProp15VoterTokenId, 15) == true
    )

    require(
      mmo.isEliminated(mmoActiveTokenId) == false
    )


    mmoProposerTokenIdUsed[mmoProposerTokenId] = true
    mmoProp15VoterTokenIdUsed[mmoProp15VoterTokenId] = true
    mmoActiveTokenIdUsed[mmoActiveTokenId] = true
    prop15WhitePaperTokenIdUsed[prop15WhitePaperTokenId] = true


    */



    postCheck(free0TokenId, 28, '28');
  }

}