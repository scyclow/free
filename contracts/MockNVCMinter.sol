// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

// 0x4f857a92269dc9b42edb7fab491679decb46e848
// interface INVCMinter {
//   function usedIOUs(uint256 iouId) external returns (bool used);
// }



contract MockNVCMinter {
  mapping(uint256 => bool) public usedIOUs;

  function __markUsed(uint256 tokenId) public {
    usedIOUs[tokenId] = true;
  }
}

