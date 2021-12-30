// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

// interface IIOU {
//   function ownerOf(uint256 tokenId) external returns (address owner);
// }

contract MockGenArt721Core {
  mapping(uint256 => address) public ownerOf;
  mapping(uint256 => uint256) public tokenIdToProjectId;


  function __markOwner(uint256 tokenId, uint256 projectId, address owner) public {
    tokenIdToProjectId[tokenId] = projectId;
    ownerOf[tokenId] = owner;
  }
}
