require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  etherscan: {
    apiKey: {
      mainnet: "<YOU_API_KEY>"
    }
  },
  allowUnlimitedContractSize: true,
  networks: {
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    base: {
      url: `https://rpc.ankr.com/base/04f160fb03790fa4d10a0a862d335ffb962f2194065f0f404dd2cdf9ded6f6c8`,
      accounts: [
        `<ACC_PK>`
      ]
    }
  }
};
