
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

/*
(mints % 16) | % chance of lockup
    0        |        0
    1        |       12.5
    2        |       25
    3        |       37.5
    4        |       50
    5        |       62.5
    6        |       75
    7        |       87.5
    8        |       100
    9        |       87.5
    10       |       75
    11       |       62.5
    12       |       50
    13       |       37.5
    14       |       25
    15       |       12.5
*/

contract Free29 is FreeChecker {
  uint256 public constant WAIT_BLOCKS = 2900000;

  uint256 public mints;

  mapping(uint256 => address) public free0TokenIdToOwner;
  mapping(uint256 => uint256) public free0TokenIdToStakedBlock;
  mapping(uint256 => bool) public isLocked;

  function isContract(address account) internal view returns (bool) {
    uint256 size;
    assembly {
      size := extcodesize(account)
    }
    return size > 0;
  }

  function onERC721Received(
    address,
    address from,
    uint256 tokenId,
    bytes calldata
  ) external returns (bytes4) {
    require(msg.sender == address(free), 'Not a Free token');
    require(free.tokenIdToCollectionId(tokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[tokenId], 'This Free0 has already been used to mint a Free29');

    require(!isContract(from));

    free0TokenIdToOwner[tokenId] = from;
    free0TokenIdToStakedBlock[tokenId] = block.number;

    return this.onERC721Received.selector;
  }


  function currentThreshold(uint256 m) public view returns (uint256) {
    return (
      m % 16 < 8
        ? m % 16
        : 16 - (m % 16)
    );
  }

  function withdraw(uint256 free0TokenId) external {
    require(msg.sender == free0TokenIdToOwner[free0TokenId], 'Not original owner');
    require(block.number > free0TokenIdToStakedBlock[free0TokenId] + WAIT_BLOCKS, 'Must wait 2900000 blocks');

    free.safeTransferFrom(address(this), free0TokenIdToOwner[free0TokenId], free0TokenId);
  }

  function claim(uint256 free0TokenId) external {
    uint256 stakedBlock = free0TokenIdToStakedBlock[free0TokenId];

    if (block.number > stakedBlock + 256) {
      return;
    }

    require(msg.sender == free0TokenIdToOwner[free0TokenId], 'Not original owner');
    require(block.number > stakedBlock, 'Must wait at least 1 block');

    uint256 rnd = uint256(
      keccak256(abi.encodePacked(
        blockhash(stakedBlock + 1), block.timestamp
      ))
    ) % 8;

    bool lockToken = rnd < currentThreshold(mints);

    mints++;

    if (!lockToken && !isContract(free0TokenIdToOwner[free0TokenId])) {
      free.safeTransferFrom(address(this), free0TokenIdToOwner[free0TokenId], free0TokenId);
      postCheck(free0TokenId, 29, '29');
    }
  }

}