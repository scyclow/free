// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

// interface IIOU {
//   function ownerOf(uint256 tokenId) external returns (address owner);
// }

contract MockIOU {
  mapping(uint256 => address) public ownerOf;

  function __markOwner(uint256 tokenId, address owner) public {
    ownerOf[tokenId] = owner;
  }
}
