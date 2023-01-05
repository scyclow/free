// SPDX-License-Identifier: CC0





pragma solidity ^0.8.17;

 
interface IFree {
  function mint(uint256 collectionId, address to) external;
  function ownerOf(uint256 tokenId) external returns (address owner);
  function tokenIdToCollectionId(uint256 tokenId) external returns (uint256 collectionId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
  function transferFrom(address from, address to, uint256 tokenId) external;
}



/*
  collector must stake a free0 token along with 0.5 eth
  they can unstake the token + their eth after 200000 blocks with a window of 1000 blocks
  if they miss their claim, they can double or nothing the amount of $ staked

  if they do not double or nothing after 2000000 blocks, anyone with a free20 token can withdraw the token and the eth
*/

contract Free20 {
  IFree public immutable free;

  struct Stake {
    uint256 blockNumber;
    uint256 claimBlockNumber;
    uint256 totalStaked;
    uint256 attempt;
    address staker;
  }

  mapping(uint256 => Stake) public free0ToStakes;
  mapping(uint256 => bool) public free0TokenIdUsed;

  uint256 public immutable stakePeriod = 200000;
  uint256 public immutable claimWindow = 1000;

  constructor(address freeAddr, uint256 _progressPeriodExpiration) {
    free = IFree(freeAddr);
  }

  function isStaking(uint256 free0TokenId) public view returns (bool) {
    Stake memory stake = free0ToStakes[free0TokenId];
    return (
      stake.blockNumber > 0
      && block.number >= stake.blockNumber
      && block.number <= stake.blockNumber + stakePeriod
    );
  }

  function isExpired(uint256 free0TokenId) public view returns (bool) {
    Stake memory stake = free0ToStakes[free0TokenId];
    return stake.blockNumber > 0 && block.number > stake.blockNumber + stakePeriod + claimWindow;
  }

  function stake(uint256 free0TokenId) public payable {
    Stake storage stake = free0ToStakes[free0TokenId];
    require(!isStaking(free0TokenId), 'This token is already being staked');
    require(free.tokenIdToCollectionId(free0TokenId) == 0, 'Invalid Free0');
    require(!free0TokenIdUsed[free0TokenId], 'This Free0 has already been used to mint a Free20');


    if (isExpired(free0TokenId)) {
      require(stake.staker == msg.sender, 'You must be the original staker');
      require(msg.value >= stake.totalStaked, 'Double of nothing');
    } else {
      require(free.ownerOf(free0TokenId) == msg.sender, 'You must be the owner of this Free0');
      require(msg.value >= 0.5 ether, 'You must stake at least 0.5 ether');
      free.transferFrom(msg.sender, address(this), free0TokenId);
    }

    stake.blockNumber = block.number;
    stake.staker = msg.sender;
    stake.totalStaked += msg.value;
    stake.attempt += 1;
  }

  function withdraw(uint256 stakedFree0TokenId, uint256 free20TokenId) public {
    Stake memory stake = free0ToStakes[stakedFree0TokenId];
    require(stake.blockNumber > 0 && block.number > stake.blockNumber + stakePeriod + claimWindow + 2000000);

    //// this is all fucke dup
    // require(free.tokenIdToCollectionId(free20TokenId) == 20, 'Invalid Free20');
    // require(free.ownerOf(free20TokenId) == msg.sender, 'You must be the owner of this Free20');

    free.transferFrom(address(this), msg.sender, stakedFree0TokenId);
    payable(msg.sender).transfer(stake.totalStaked);
    stake.totalStaked = 0;
  }


  function claim(uint256 free0TokenId) public {
    Stake memory stake = free0ToStakes[free0TokenId];
    require(stake.staker == msg.sender, 'You must be the original staker');
    require(stake.claimBlockNumber == 0, 'You have already claimed');

    require(
      block.number > stake.blockNumber + stakePeriod
      && block.number < stake.blockNumber + stakePeriod + claimWindow,
      'You can only claim within the claim window'
    );
    free.appendAttributeToToken(free0TokenId, 'Used For Free20 Mint', 'true');

    free0TokenIdUsed[free0TokenId] = true;
    stake.claimBlockNumber = block.number;

    free.mint(20, msg.sender);
    free.transferFrom(address(this), msg.sender, free0TokenId);

    payable(msg.sender).transfer(stake.totalStaked);
    stake.totalStaked = 0;
  }
}

