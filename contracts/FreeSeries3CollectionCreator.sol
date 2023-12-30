// SPDX-License-Identifier: CC0


/*
Free Series 3 Deployer
*/


pragma solidity ^0.8.23;


interface IFreeBase {
  function owner() external view returns (address);
  function transferOwnership(address newOwner) external;

  function createCollection(
    address minter,
    string calldata _namePrefix,
    string calldata _externalUrl,
    string calldata _imgUrl,
    string calldata _imgExtension,
    string calldata _description
  ) external;
}



contract FreeSeries3CollectionCreator {
  address public steviep = 0x47144372eb383466D18FC91DB9Cd0396Aa6c87A4;
  IFreeBase public immutable free = IFreeBase(0x30b541f1182ef19c56a39634B2fdACa5a0F2A741);

  function reclaimFreeOwnership() public {
    require(msg.sender == steviep);
    free.transferOwnership(steviep);
  }

  function register(address[] calldata freeAddrs) external {
    require(msg.sender == steviep);

    string memory url = 'https://steviep.xyz/free';
    string memory imrUrl = 'ipfs://QmSV8dkHDYxGLBkex8MKdV5eNEUt2wcMPS4Jf8yNHaqxhu/';
    string memory extension = '.jpg';

    free.createCollection(freeAddrs[0], 'Free21 #', url, string(abi.encodePacked(imrUrl, '21')), extension, "Free of charge");
    free.createCollection(freeAddrs[1], 'Free22 #', url, string(abi.encodePacked(imrUrl, '22')), extension, "If it's free, you are the product");
    free.createCollection(freeAddrs[2], 'Free23 #', url, string(abi.encodePacked(imrUrl, '23')), extension, "Ladies drink free");
    free.createCollection(freeAddrs[3], 'Free24 #', url, string(abi.encodePacked(imrUrl, '24')), extension, "Free time");
    free.createCollection(freeAddrs[4], 'Free25 #', url, string(abi.encodePacked(imrUrl, '25')), extension, "Free Tibet");
    free.createCollection(freeAddrs[5], 'Free26 #', url, string(abi.encodePacked(imrUrl, '26')), extension, "Free Taiwan");
    free.createCollection(freeAddrs[6], 'Free27 #', url, string(abi.encodePacked(imrUrl, '27')), extension, "Free Palestine");
    free.createCollection(freeAddrs[7], 'Free28 #', url, string(abi.encodePacked(imrUrl, '28')), extension, "Free for the taking");
    free.createCollection(freeAddrs[8], 'Free29 #', url, string(abi.encodePacked(imrUrl, '29')), extension, "Free trade");
    free.createCollection(freeAddrs[9], 'Free30 #', url, string(abi.encodePacked(imrUrl, '30')), extension, "Freewheeling");
    free.createCollection(freeAddrs[10], 'Free31 #', url, string(abi.encodePacked(imrUrl, '31')), extension, "Free and easy");
    free.createCollection(freeAddrs[11], 'Free32 #', url, string(abi.encodePacked(imrUrl, '32')), extension, "Free parking");
    free.createCollection(freeAddrs[12], 'Free33 #', url, string(abi.encodePacked(imrUrl, '33')), extension, "Free throw");

    reclaimFreeOwnership();
    require(free.owner() == steviep);
  }
}
