const { Web3 } = require('web3');
require('dotenv').config(); // This loads the environment variables


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

async function main() {
    // Get contract ABI and Bytecode from Hardhat artifacts
    const FlashLoanArtifact = require('../../artifacts/contracts/mocks/tests/FlashloanRepayExample.sol/FlashloanRepayExample.json');
    const abi = FlashLoanArtifact.abi;
    const bytecode = FlashLoanArtifact.bytecode;

    const poolAddressesProvider = '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb'; // OPTIMISM

    // Deploy contract using Web3.js
    const FlashLoanContract = new web3.eth.Contract(abi);
    const deployedContract = await FlashLoanContract
        .deploy({ data: bytecode, arguments: [poolAddressesProvider] })
        .send({ 
            from: account.address, 
            gas: 9000000 });

            console.log('Contract deployed to:', deployedContract.options.address);  // Log the deployed contract address

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });