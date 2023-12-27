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


import "./FreeChecker.sol";

pragma solidity ^0.8.23;



interface IArtBlocks {
  function tokenIdToProjectId(uint256 tokenId) external returns (uint256 projectId);
  function ownerOf(uint256 tokenId) external returns (address owner);
}

interface IFastCashDopamineVault {
  function redemptions(uint256 tokenId) external view returns (bool redeemed);
}

contract Free22 is FreeChecker {
  IArtBlocks public immutable artBlocks = IArtBlocks(0x99a9B7c1116f9ceEB1652de04d5969CcE509B069);
  IFastCashDopamineVault public immutable fastCashDopamineVault = IFastCashDopamineVault(0x56FF4F826795f2dE13A89F60ea7B1cF14c714252);

  mapping(uint256 => bool) public dopamineMachineTokenIdUsed;


  function claim(uint256 free0TokenId, uint256 dopamineMachineTokenId) external {
    preCheck(free0TokenId, '22');

    require(artBlocks.ownerOf(dopamineMachineTokenId) == msg.sender, 'You must own this Dopamine Machine');
    require(fastCashDopamineVault.redemptions(dopamineMachineTokenId), 'Not redeemed for FastCash');
    require(!dopamineMachineTokenIdUsed[dopamineMachineTokenId], 'Dopamine Machine already used');
    dopamineMachineTokenIdUsed[dopamineMachineTokenId] = true;

    postCheck(free0TokenId, 22, '22');
  }

}