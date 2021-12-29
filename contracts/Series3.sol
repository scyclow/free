// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

 
interface IFree {
  function mint(uint256 seriesId, address to) external;
  function tokenIdToSeriesId(uint256 tokenId) external returns (uint256 seriesId);
  function appendAttributeToToken(uint256 tokenId, string memory attrKey, string memory attrValue) external;
}


contract Series3 {
  IFree free;

  struct Stake {
    uint256 firstStakeBlockNumber;
    uint256 secondStakeBlockNumber;
    uint256 mintBlockNumber;
    uint256 totalStaked;
  }

  mapping(address => Stake) addressToStakes;
  mapping(uint256 => bool) public series0UsedForSeries3Mint;

  address public withdrawer;

  constructor() {
    free = IFree(address(0));
    withdrawer = msg.sender;
  }

  function transferWithdrawership(address newWithdrawer) public {
    require(withdrawer == msg.sender);
    withdrawer = newWithdrawer;
  }

  function firstStake() public payable {
    Stake storage stake = addressToStakes[msg.sender];
    require(stake.firstStakeBlockNumber == 0, 'You have already attempted a first stake');
    require(msg.value >= 0.25 ether, 'You must stake at least 0.25 ether');

    stake.firstStakeBlockNumber = block.number;
    stake.totalStaked += msg.value;
  }

  function secondStake() public payable {
    Stake storage stake = addressToStakes[msg.sender];
    require(stake.firstStakeBlockNumber != 0, 'You have not attempted a first stake');
    require(stake.secondStakeBlockNumber == 0, 'You have already attempted a second stake');
    require(
      block.number > stake.firstStakeBlockNumber + 5000
      && block.number < stake.firstStakeBlockNumber + 5100,
      'You must wait between 5000 and 5100 blocks to make your second stake'
    );
    require(msg.value >= 0.25 ether, 'You must stake at least 0.25 ether');

    stake.secondStakeBlockNumber = block.number;
    stake.totalStaked += msg.value;
  }

  function withdraw(address staker) public {
    require(withdrawer == msg.sender);

    Stake storage stake = addressToStakes[staker];

    bool stakesFailed = block.number > stake.firstStakeBlockNumber + 5100 && block.number > stake.secondStakeBlockNumber + 5100;
    bool ethStillStaked = stake.totalStaked > 0;
    bool isMinted = stake.mintBlockNumber > 0;
    require(
      stakesFailed && ethStillStaked && isMinted,
      'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
    );

    stake.totalStaked = 0;

    payable(withdrawer).transfer(stake.totalStaked);
  }

  function claim(uint256 free0TokenId) public {
    Stake storage stake = addressToStakes[msg.sender];

    require(stake.mintBlockNumber == 0, 'You have already minted');
    require(
      block.number > stake.secondStakeBlockNumber + 5000
      && block.number < stake.secondStakeBlockNumber + 5100,
      'You must wait between 5000 and 5100 blocks to claim'
    );
    require(free.tokenIdToSeriesId(free0TokenId) == 0, 'You must use a Free0 as a mint pass');
    require(!series0UsedForSeries3Mint[free0TokenId], 'Free0 already used to mint Free1');
    free.appendAttributeToToken(free0TokenId, 'Used For Free3 Mint', 'true');

    series0UsedForSeries3Mint[free0TokenId] = true;

    stake.mintBlockNumber = block.number;
    stake.totalStaked = 0;

    free.mint(3, msg.sender);
    payable(msg.sender).transfer(stake.totalStaked);
  }
}





