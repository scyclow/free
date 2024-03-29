// SPDX-License-Identifier: CC0


/*

CC0 2023
*/


pragma solidity ^0.8.23;


import "./Dependencies.sol";
import "./ThreeBallsGridURI.sol";


contract Free33Mock {
  function THREE_BALLS(uint256) external pure returns (bool) {
    return true;
  }
  function ballCoords(uint256 tokenId) external pure returns (uint256, uint256) {
    if (tokenId == 12) {
      return (2,2);
    } else if (tokenId == 30) {
      return (1,1);
    } else if (tokenId == 36) {
      return (5,5);
    }
  }
  function isLine(int[2] calldata, int[2] calldata, int[2] calldata) external pure returns (bool) {
    return true;
  }
}

contract ThreeBallsGridMock {
  uint256 public maxSupply = 333;
  uint256 public totalSupply;

  address public free33;
  address public owner;

  ThreeBallsGridURI public tokenURIContract;

  struct Balls {
    uint256 a;
    uint256 b;
    uint256 c;
  }

  mapping(uint256 => Balls) public tokenIdToBalls;

  constructor() {
    address free33Mock = address(new Free33Mock());
    tokenURIContract = new ThreeBallsGridURI(free33Mock);

    tokenIdToBalls[0].a = 12;
    tokenIdToBalls[0].b = 30;
    tokenIdToBalls[0].c = 36;
  }


  function isLight(uint256) external pure returns (bool) {
    return false;
  }


  function tokenURI(uint256 tokenId) public view returns (string memory) {
    return tokenURIContract.tokenURI(tokenId);
  }

}

