const { Web3 } = require('web3');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('SimpleStorage Contract', function () {
  let web3;
  let accounts;
  let simpleStorage;
  let simpleStorageAddress;
  const initialData = 42;

  before(async function () {
    // Initialize web3 and get accounts
    web3 = new Web3(ethers.provider);
    accounts = await web3.eth.getAccounts();

    // Deploy the contract
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage');
    simpleStorage = await SimpleStorage.deploy(initialData);

    // Get the deployed contract's address
    simpleStorageAddress = simpleStorage.address;
  });

  it('should deploy the contract and set the initial storedData correctly', async function () {
    // Check the initial value of storedData
    const storedData = await simpleStorage.storedData();
    assert.equal(storedData.toString(), initialData.toString(), 'Initial storedData is incorrect');
  });

  it('should update storedData when set function is called', async function () {
    const newValue = 100;

    // Call the set function to update the storedData
    await simpleStorage.set(newValue);

    // Check the new value of storedData
    const storedData = await simpleStorage.storedData();
    assert.equal(storedData.toString(), newValue.toString(), 'storedData was not updated correctly');
  });

  it('should allow only the owner to update storedData (if applicable)', async function () {
    // In this contract, there's no specific owner logic, so any account can call set()
    const newValue = 123;

    // Call the set function from a different account (to simulate different users)
    await simpleStorage.connect(accounts[1]).set(newValue);

    // Check if storedData was updated
    const storedData = await simpleStorage.storedData();
    assert.equal(storedData.toString(), newValue.toString(), 'storedData was not updated correctly by different account');
  });
});
