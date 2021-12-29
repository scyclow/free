/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.11"},
      {version: "0.8.0"},
    ]
  }
};