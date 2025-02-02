const Web3 = require('web3');
const { assert } = require('chai');
const { abi, evm } = require('./path_to_compiled_FlashloanRepayExample.json'); // Replace with actual ABI and bytecode location
require('dotenv').config();

// Web3 setup and environment variables
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Aave V3 IPoolAddressesProvider address for the testnet (replace with correct one)
const poolAddressesProviderAddress = '0x36616cf17557639614c1cdDb356b1B83fc0B2132'; // OP Sepolia
const poolAddress = '0xb50201558B00496A145fE76f7424749556E326D8'; // Replace with Aave V3 Pool contract address

let deployedContract;

beforeEach(async () => {
  // Deploy the FlashLoanRepayExample contract
  const flashLoanContract = new web3.eth.Contract(abi);

  // Deploy contract with the poolAddressesProviderAddress passed as constructor argument
  deployedContract = await flashLoanContract
    .deploy({ data: evm.bytecode.object, arguments: [poolAddressesProviderAddress] })
    .send({ from: account.address, gas: 5000000 });

  console.log("Deployed contract at address:", deployedContract.options.address);
});

// Test to initiate flash loan and verify repayment
it('should deploy the contract and execute a flash loan', async () => {
  const assetAddress = '0x...'; // Replace with the address of the token (e.g., USDT) on the testnet
  const amount = web3.utils.toWei('100', 'ether'); // The amount you want to borrow

  // Approve the contract to supply asset to Aave pool (optional step before flash loan)
  const tokenContract = new web3.eth.Contract(erc20Abi, assetAddress); // Replace with the actual ERC20 ABI
  await tokenContract.methods
    .approve(deployedContract.options.address, amount)
    .send({ from: account.address });

  // Supply asset to the pool (optional step before flash loan)
  await deployedContract.methods.supplyAsset(assetAddress, amount).send({ from: account.address });

  // Initiate flash loan
  const tx = await deployedContract.methods.initiateFlashLoan(assetAddress, amount).send({ from: account.address });

  // Assert that the transaction was successful
  assert.isOk(tx.transactionHash, 'Flash loan transaction was not successful');

  // Check balance after loan to ensure repayment
  const tokenBalance = await tokenContract.methods.balanceOf(account.address).call();
  assert.isTrue(tokenBalance > 0, 'Token balance should be greater than zero');

  console.log("Flash loan executed and repayment was successful");
});

