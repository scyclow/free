// SPDX-License-Identifier: CC0


/*
████████ ██   ██ ██████  ███████ ███████
   ██    ██   ██ ██   ██ ██      ██
   ██    ███████ ██████  █████   █████
   ██    ██   ██ ██   ██ ██      ██
   ██    ██   ██ ██   ██ ███████ ███████


██████   █████  ██      ██      ███████
██   ██ ██   ██ ██      ██      ██
██████  ███████ ██      ██      ███████
██   ██ ██   ██ ██      ██           ██
██████  ██   ██ ███████ ███████ ███████


 ██████  ██████  ██ ██████
██       ██   ██ ██ ██   ██
██   ███ ██████  ██ ██   ██
██    ██ ██   ██ ██ ██   ██
 ██████  ██   ██ ██ ██████



CC0 2023 - steviep.eth
*/


import "./Dependencies.sol";
import "./Free33.sol";
import "./ThreeBallsGridURI.sol";


pragma solidity ^0.8.23;

contract ThreeBallsGrid is ERC721, Ownable {
  uint256 public maxSupply = 333;
  uint256 public totalSupply;

  address public free33;

  ThreeBallsGridURI public tokenURIContract;
  ThreeBallsGridMinter public minter;

  struct Balls {
    uint256 a;
    uint256 b;
    uint256 c;
  }

  mapping(uint256 => Balls) public tokenIdToBalls;
  mapping(uint256 => bool) public isLight;

  event MetadataUpdate(uint256 _tokenId);
  event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);


  constructor(address newOwner) ERC721('Three Balls Grid', '3BG') {
    minter = new ThreeBallsGridMinter();
    tokenURIContract = new ThreeBallsGridURI(msg.sender);

    free33 = msg.sender;
    transferOwnership(newOwner);
    _mint(newOwner, totalSupply++);
  }

  function exists(uint256 tokenId) external view returns (bool) {
    return _exists(tokenId);
  }

  function mint(address recipient) public {
    require(address(minter) == msg.sender, 'Caller is not the minting address');
    require(totalSupply < maxSupply, 'Cannot exceed 333');

    _mint(recipient, totalSupply++);
  }

  function update() external {
    require(msg.sender == free33);
    emit BatchMetadataUpdate(0, totalSupply);
  }

  function setMinter(address newMinter) external onlyOwner {
    minter = ThreeBallsGridMinter(newMinter);
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    return tokenURIContract.tokenURI(tokenId);
  }

  function setURIContract(address _uriContract) external onlyOwner {
    tokenURIContract = ThreeBallsGridURI(_uriContract);
    emit BatchMetadataUpdate(0, totalSupply);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
    return (
      interfaceId == bytes4(0x49064906) ||
      super.supportsInterface(interfaceId)
    );
  }

  function setBalls(uint256 tokenId, uint256 a, uint256 b, uint256 c) external {
    require(ownerOf(tokenId) == msg.sender, 'Must own token');
    tokenIdToBalls[tokenId].a = a;
    tokenIdToBalls[tokenId].b = b;
    tokenIdToBalls[tokenId].c = c;

    emit MetadataUpdate(tokenId);
  }

  function setLightMode(uint256 tokenId, bool _isLight) external {
    require(ownerOf(tokenId) == msg.sender, 'Must own token');
    isLight[tokenId] = _isLight;
    emit MetadataUpdate(tokenId);
  }
}


interface IFree19 {
  function lastAssigned() external view returns (uint256);
  function claimer() external view returns (address);
}


contract ThreeBallsGridMinter {
  IFree19 public free19 = IFree19(0xaBCeF3a4aDC27A6c962b4fC17181F47E62244EF0);
  address public baseContract;
  mapping(address => uint256) public minterToTimestamp;


  constructor() {
    baseContract = msg.sender;
  }

  function mint() external {
    require(free19.claimer() == msg.sender, 'Must be Free19 contract claimer');
    require(free19.lastAssigned() + 30 minutes < block.timestamp, 'Must be Free19 contract claimer for > 30 minutes');
    require(minterToTimestamp[msg.sender] + 15 minutes < block.timestamp, 'Must wait at least 15 minutes between mints');

    minterToTimestamp[msg.sender] = block.timestamp;
    ThreeBallsGrid(baseContract).mint(msg.sender);
  }
}

