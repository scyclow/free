// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$        /$$$$$$   /$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/       /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$      | $$            |__/  \ $$| $$  \ $$
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$           /$$$$$$/|  $$$$$$/
| $$__/   | $$__  $$| $$__/   | $$__/          /$$____/  >$$__  $$
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


interface MoneyMakingOpportunity {
  function ownerOf(uint256) external view returns (address);
  function votes(uint256, uint256) external view returns (bool);
  function calculateVotes(uint256) external view returns (uint256);
  function isEliminated(uint256) external view returns (bool);
  function tokenIdToWeek(uint256) external view returns (uint256);
  function settlementAddressProposals(uint256) external view returns (address);
}

interface Prop15 {
  function ownerOf(uint256) external view returns (address);
}


contract Free28 is FreeChecker {

  MoneyMakingOpportunity public mmo = MoneyMakingOpportunity(0x41d3d86a84c8507A7Bc14F2491ec4d188FA944E7);
  Prop15 public prop15 = Prop15(0x1c218412046fdFCD561806bE1DCb2c94307Be625);

  mapping(uint256 => bool) public mmoProposerTokenIdUsed;
  mapping(uint256 => bool) public mmoProp15VoterTokenIdUsed;
  mapping(uint256 => bool) public mmoActiveTokenIdUsed;
  mapping(uint256 => bool) public prop15WhitePaperTokenIdUsed;




  function claim(
    uint256 free0TokenId,
    uint256 prop15WhitePaperTokenId,
    uint256 mmoProp15VoterTokenId,
    uint256 mmoActiveTokenId,
    uint256 mmoProposerTokenId,
    uint256[10] calldata orderedYayVotes
  ) external {
    preCheck(free0TokenId, '28');


    require(prop15.ownerOf(prop15WhitePaperTokenId) == msg.sender, 'Must own Prop15 token');
    require(mmo.ownerOf(mmoProp15VoterTokenId) == msg.sender, 'Must own MMO token');
    require(mmo.ownerOf(mmoActiveTokenId) == msg.sender, 'Must own MMO token');
    require(mmo.ownerOf(mmoProposerTokenId) == msg.sender, 'Must own MMO token');


    require(!prop15WhitePaperTokenIdUsed[prop15WhitePaperTokenId], 'Prop15 token used');
    require(!mmoProp15VoterTokenIdUsed[mmoProp15VoterTokenId], 'MMO token used');
    require(!mmoActiveTokenIdUsed[mmoActiveTokenId], 'MMO token used');
    require(!mmoProposerTokenIdUsed[mmoProposerTokenId], 'MMO token used');

    require(
      mmo.votes(mmoProp15VoterTokenId, 15) == true,
      'Did not vote for Prop15'
    );

    require(
      mmo.isEliminated(mmoActiveTokenId) == false,
      'MMO has already been thrown overboard'
    );

    uint256 proposalWeek = mmo.tokenIdToWeek(mmoProposerTokenId);
    require(
      mmo.settlementAddressProposals(proposalWeek) != address(0),
      'No settlement address proposed'
    );
    for (uint256 i; i < 10; ++i) {
      if (i > 0) require(orderedYayVotes[i] > orderedYayVotes[i-1], 'Yays unordered');
      require(mmo.votes(orderedYayVotes[i], proposalWeek) == true, 'Not yay vote');
    }



    mmoProposerTokenIdUsed[mmoProposerTokenId] = true;
    mmoProp15VoterTokenIdUsed[mmoProp15VoterTokenId] = true;
    mmoActiveTokenIdUsed[mmoActiveTokenId] = true;
    prop15WhitePaperTokenIdUsed[prop15WhitePaperTokenId] = true;






    postCheck(free0TokenId, 28, '28');
  }

}