const { Web3 } = require('web3');
const { assert } = require('chai');
const { expect } = require('chai'); 
const { ethers } = require('hardhat');
require('dotenv').config(); 


// Access the environment variables
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const infuraUrl = process.env.INFURA;

console.log("Infura Project ID:", infuraProjectId);  // Log the values to make sure they are loaded
console.log("Private Key:", privateKey);             // Log the values to make sure they are loaded
console.log("Infura URL:", infuraUrl);               // Log the values to make sure they are loaded

const web3 = new Web3(infuraUrl);  // Connect to Infura

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

describe("SimpleStorage Contract", function () {
  this.timeout(100000);  // Increase timeout to 100 seconds

  let simpleStorage;
  
  before(async function () {
    // Get contract ABI and Bytecode from Hardhat artifacts
    const SimpleStorageArtifact = require('../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json');
    const abi = SimpleStorageArtifact.abi;
    const bytecode = SimpleStorageArtifact.bytecode;

    // Deploy contract using Web3.js
    const SimpleStorageContract = new web3.eth.Contract(abi);
    const gasEstimate = await SimpleStorageContract.deploy({ data: bytecode, arguments: [42] })
        .estimateGas({ from: account.address });

    // Deploy the contract and store it in simpleStorage
    const deployedContract = await SimpleStorageContract
        .deploy({ data: bytecode, arguments: [42] })
        .send({ from: account.address, gas: gasEstimate });

    console.log("Contract deployed at:", deployedContract.options.address);
    simpleStorage = deployedContract;  // Assign the deployed contract to the variable
  });

  it("should deploy the contract and set the initial storedData correctly", async function () {
    const storedData = await simpleStorage.methods.storedData().call();
    expect(storedData).to.equal('42');  // The value is returned as a string, so compare with '42'
  });

  it("should update the storedData", async function () {
    await simpleStorage.methods.set(100).send({ from: account.address });
    const newStoredData = await simpleStorage.methods.storedData().call();
    expect(newStoredData).to.equal('100');  // Again, compare with '100' (string)
  });
});