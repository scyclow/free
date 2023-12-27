/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-web3");
const STUFF = require('../DEV_KEYS/stuff.json')


module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.23"},
      {version: "0.8.17"},
      {version: "0.8.11"},
      {version: "0.8.0"},
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${STUFF.INFURA_KEY}`,
        blockNumber: 18815078,
      },
    },
    mumbai: {
      url: STUFF.POLYGON_MUMBAI_URL,
      accounts: [`0x${STUFF.DEV1}`, `0x${STUFF.DEV2}`, `0x${STUFF.DEV3}`]
    },
    rinkeby: {
      url: STUFF.ETH_RINKEBY_URL,
      accounts: [`0x${STUFF.DEV1}`, `0x${STUFF.DEV2}`, `0x${STUFF.DEV3}`]
    },
    goerli: {
      url: STUFF.ETH_GOERLI_URL,
      accounts: [`0x${STUFF.DEV1}`, `0x${STUFF.DEV2}`, `0x${STUFF.DEV3}`]
    }
  },
  mocha: {
    timeout: 200000
  },
};