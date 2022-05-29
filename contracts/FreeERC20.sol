// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/
| $$      | $$  \ $$| $$      | $$
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$
| $$__/   | $$__  $$| $$__/   | $$__/
| $$      | $$  \ $$| $$      | $$
| $$      | $$  | $$| $$$$$$$$| $$$$$$$$
|__/      |__/  |__/|________/|________/



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


CC0 2021
*/


import "./ERC20Dependencies.sol";


pragma solidity ^0.8.11;

interface IERC1155Connection {
  function emitTransferEvent(address operator, address from, address to, uint256 id, uint256 amount) external;
}

contract FreeERC20 is ERC20, Ownable {
  address public erc1155ConnectedAddress;
  uint256 public erc1155TokenId;
  address public mintingAddress;

  constructor() ERC20('Free', 'FREE') {
    mintingAddress = _msgSender();
  }

  function decimals() public view virtual override returns (uint8) {
    return 0;
  }

  modifier onlyMinter() {
    require(mintingAddress == _msgSender(), 'Caller is not the minting address');
    _;
  }

  function setMintingAddress(address minter) external onlyOwner {
    mintingAddress = minter;
  }


  function mint(address to, uint256 amount) public onlyMinter {
    _mint(to, amount);
  }

  function connectERC1155(address addr, uint256 tokenId) public onlyOwner {
    erc1155ConnectedAddress = addr;
    erc1155TokenId = tokenId;
  }

  function connectedTransferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
    require(_msgSender() == erc1155ConnectedAddress);
    _transfer(sender, recipient, amount);
  }

  function _afterTokenTransfer(
      address from,
      address to,
      uint256 amount
  ) internal virtual override {
    IERC1155Connection(erc1155ConnectedAddress).emitTransferEvent(_msgSender(), from, to, erc1155TokenId, amount);
  }

}