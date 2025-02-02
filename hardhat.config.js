require("@nomicfoundation/hardhat-toolbox");
require("hardhat-preprocessor");
require("dotenv").config();
const fs = require('fs')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { 
          version: '0.8.10',
          settings: {
            // viaIR: true,
            optimizer: {
              enabled: true,
              runs: 10000,
            },
          }
        }
    ]
  },
  networks: {
    OPSepolia: {
        url: process.env.INFURA,
    },
  }
};
