const { Web3 } = require('web3');
const config = require('./config');


const web3 = new Web3(`https://optimism-sepolia.infura.io/v3/${config.infuraProjectId}`); // Or connect to another network

const privateKey = `${config.privateKey}`;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// Set the account as the default signer
web3.eth.accounts.wallet.add(account);


async function main() {

    // Get the first account from Hardhat's local network (or your provider)
    const accounts = await web3.eth.getAccounts();

    // Get contract ABI and Bytecode from Hardhat artifacts
    const SimpleStorageArtifact = require('.../artifacts/SimpleStorage.sol/SimpleStorage.json');
    const abi = SimpleStorageArtifact.abi;
    const bytecode = SimpleStorageArtifact.bytecode;

    // Deploy contract using Web3.js
    const SimpleStorageContract = new web3.eth.Contract(abi);
    const deployedContract = await SimpleStorageContract
        .deploy({ data: bytecode, arguments: [42] })
        .send({ from: accounts[0], gas: 2000000 });

    console.log('Contract deployed to:', deployedContract.options.address);

    // Interact with the deployed contract
    const storedData = await deployedContract.methods.storedData().call();
    console.log('Stored Data:', storedData);

    // Update the stored data
    await deployedContract.methods.set(100).send({ from: accounts[0] });
    const newStoredData = await deployedContract.methods.storedData().call();
    console.log('Updated Stored Data:', newStoredData);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
