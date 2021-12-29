// SPDX-License-Identifier: MIT

import "./Dependencies.sol";

// import "hardhat/console.sol";


pragma solidity ^0.8.11;


contract Free is ERC721, ERC721Burnable, Ownable {
  using Strings for uint256;
  uint256 private _tokenIdCounter;
  uint256 private _seriesIdCounter;

  string constant public license = 'CC0';

  struct Metadata {
    uint256 seriesId;
    string namePrefix;
    string externalUrl;
    string imgUrl;
    string imgExtension;
    string description;
  }

  mapping(uint256 => Metadata) public seriesIdToMetadata;
  mapping(uint256 => uint256) public tokenIdToSeriesId;
  mapping(uint256 => uint256) public tokenIdToSeriesCount;
  mapping(uint256 => address) public seriesIdToMinter;
  mapping(uint256 => uint256) public seriesSupply;
  mapping(uint256 => string) public tokenIdToAttributes;
  mapping(address => bool) attributeUpdateAllowList;


  event ProjectEvent(address indexed poster, string indexed eventType, string content);
  event TokenEvent(address indexed poster, uint256 indexed tokenId, string indexed eventType, string content);

  constructor() ERC721('Free', 'FREE') {
    _tokenIdCounter = 0;
    _seriesIdCounter = 0;
  }

  function totalSupply() public view virtual returns (uint256) {
    return _tokenIdCounter;
  }

  function createSeries(
    address minter,
    string calldata _namePrefix,
    string calldata _externalUrl,
    string calldata _imgUrl,
    string calldata _imgExtension,
    string calldata _description
  ) public onlyOwner {
    seriesIdToMinter[_seriesIdCounter] = minter;
    attributeUpdateAllowList[minter] = true;

    Metadata storage metadata = seriesIdToMetadata[_seriesIdCounter];
    metadata.namePrefix = _namePrefix;
    metadata.externalUrl = _externalUrl;
    metadata.imgUrl = _imgUrl;
    metadata.imgExtension = _imgExtension;
    metadata.description = _description;

    _seriesIdCounter++;
  }

  function mint(uint256 seriesId, address to) public {
    require(seriesIdToMinter[seriesId] == _msgSender(), 'Caller is not the minting address');
    require(seriesId < _seriesIdCounter, 'Series ID does not exist');

    _mint(to, _tokenIdCounter);
    tokenIdToSeriesId[_tokenIdCounter] = seriesId;

    tokenIdToSeriesCount[_tokenIdCounter] = seriesSupply[seriesId];
    seriesSupply[seriesId]++;
    _tokenIdCounter++;
  }

  function appendAttributeToToken(uint256 tokenId, string calldata attrKey, string calldata attrValue) public {
    require(attributeUpdateAllowList[msg.sender], "Sender not on attribute update allow list.");

    string memory existingAttrs = tokenIdToAttributes[tokenId];

    tokenIdToAttributes[tokenId] = string(abi.encodePacked(
      existingAttrs, ',{"trait_type":"', attrKey,'","value":', attrValue,'}'
    ));
  }


  function setMintingAddress(uint256 seriesId, address minter) public onlyOwner {
    require(seriesId < _seriesIdCounter, 'Series ID does not exist');

    address existingMinter = seriesIdToMinter[seriesId];
    attributeUpdateAllowList[existingMinter] = false;
    attributeUpdateAllowList[minter] = true;
    seriesIdToMinter[seriesId] = minter;
  }


  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');

    Metadata memory metadata = seriesIdToMetadata[tokenIdToSeriesId[tokenId]];
    string memory tokenIdString = tokenId.toString();
    string memory seriesIdString = tokenIdToSeriesId[tokenId].toString();
    string memory seriesCountString = tokenIdToSeriesCount[tokenId].toString();
    string memory tokenAttributes = tokenIdToAttributes[tokenId];

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "', metadata.namePrefix, seriesCountString,
            '", "description": "', metadata.description,
            '", "license": "', license,
            '", "image": "', metadata.imgUrl, metadata.imgExtension,
            '", "external_url": "', metadata.externalUrl, '?seriesId=', seriesIdString, '&tokenId=', tokenIdString,
            '", "attributes": [{"trait_type":"series", "value":"', seriesIdString,'"}', tokenAttributes, ']}'
          )
        )
      )
    );
    return string(abi.encodePacked('data:application/json;base64,', json));

  }


  function updateMetadataParams(
    uint256 seriesId,
    string calldata _namePrefix,
    string calldata _externalUrl,
    string calldata _imgUrl,
    string calldata _imgExtension,
    string calldata _description
  ) public onlyOwner {
    Metadata storage metadata = seriesIdToMetadata[seriesId];

    metadata.namePrefix = _namePrefix;
    metadata.externalUrl = _externalUrl;
    metadata.imgUrl = _imgUrl;
    metadata.imgExtension = _imgExtension;
    metadata.description = _description;
  }

  function emitProjectEvent(string calldata _eventType, string calldata _content) public onlyOwner {
    emit ProjectEvent(_msgSender(), _eventType, _content);
  }

  function emitTokenEvent(uint256 tokenId, string calldata _eventType, string calldata _content) public {
    require(
      owner() == _msgSender() || ERC721.ownerOf(tokenId) == _msgSender(),
      'Only project or token owner can emit token event'
    );
    emit TokenEvent(_msgSender(), tokenId, _eventType, _content);
  }
}