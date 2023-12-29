
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


interface FreeClaimer {
  function free0TokenIdUsed(uint256) external view returns (bool);
}

contract Free21 is FreeChecker {
  mapping(uint256 => address) public free0TokenIdToOwner;
  mapping(uint256 => uint256) public free0TokenStakeBlockNumber;

  function isContract(address account) internal view returns (bool) {
    uint256 size;
    assembly {
      size := extcodesize(account)
    }
    return size > 0;
  }

  function isValidFree0(uint256 tokenId) public view returns (bool) {
    return
      FreeClaimer(free.collectionIdToMinter(8)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(9)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(10)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(11)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(12)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(13)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(14)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(15)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(16)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(17)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(18)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(19)).free0TokenIdUsed(tokenId) &&
      FreeClaimer(free.collectionIdToMinter(20)).free0TokenIdUsed(tokenId)
    ;
  }

  function onERC721Received(
    address,
    address from,
    uint256 tokenId,
    bytes calldata
  ) external returns (bytes4) {
    require(msg.sender == address(free), 'Not a Free token');
    require(free.tokenIdToCollectionId(tokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[tokenId], 'This Free0 has already been used to mint a Free21');

    require(!isContract(from), 'Cannot be owned by a contract');
    require(isValidFree0(tokenId), 'Token not used to complete Frees 8-20');

    free0TokenIdToOwner[tokenId] = from;
    free0TokenStakeBlockNumber[tokenId] = block.number;

    return this.onERC721Received.selector;
  }


  function claim(uint256 free0TokenId, uint256 tokenToRescue) external {
    preCheck(free0TokenId, '21');
    require(isValidFree0(free0TokenId), 'Token not used to complete Frees 8-20');


    require(free0TokenStakeBlockNumber[tokenToRescue] < block.number, 'Must wait at least one block to rescue');
    require(!isContract(msg.sender), 'Cannot be owned by a contract');

    free.safeTransferFrom(address(this), free0TokenIdToOwner[tokenToRescue], tokenToRescue);



    postCheck(tokenToRescue, 21, '21');
    postCheck(free0TokenId, 21, '21');
  }


}