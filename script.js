// Import the web3 library
const Web3 = require('web3');

// Check if the user has MetaMask installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}

// Set up the web3 provider to use the local development network
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// Get the user's accounts from the local development network
web3.eth.getAccounts()
    .then((accounts) => {
        userAddress = accounts[0];
        getBalance();
    })
    .catch((error) => {
        console.error(error);
    });

// Get the contract address and ABI from the deployed contract
const contractAddress = "0x99D2f964F1f2996502E5eE1eaFcB09d967fcB224";
const contractABI = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
	  anonymous: false,
	  inputs: [ [Object], [Object], [Object] ],
	  name: 'Sent',
	  type: 'event'
	},
	{
	  inputs: [ [Object] ],
	  name: 'balances',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function',
	  constant: true
	},
	{
	  inputs: [ [Object], [Object] ],
	  name: 'send',
	  outputs: [],
	  stateMutability: 'nonpayable',
	  type: 'function'
	},
	{
	  inputs: [ [Object] ],
	  name: 'balanceOf',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function',
	  constant: true
	}
  ];

// Create an instance of the contract
const catCoin = new web3.eth.Contract(contractABI, contractAddress);

// Get the user's address
let userAddress;

web3.eth.getAccounts()
    .then((accounts) => {
        userAddress = accounts[0];
        getBalance();
    })
    .catch((error) => {
        console.error(error);
    });

// Get the user's balance of CatCoin and display it
async function getBalance() {
    if (!userAddress) {
        console.log("No user address found");
        return;
    }

    const balance = await catCoin.methods.balanceOf(userAddress).call();
    document.getElementById("balance").innerText = balance.toString();
}

// Handle the form submission to send CatCoin to another address
const form = document.getElementById("send-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!userAddress) {
        console.log("No user address found");
        return;
    }

    const toAddress = event.target.elements.recipient.value;
    const amount = event.target.elements.amount.value;

    const transaction = await catCoin.methods.transfer(toAddress, amount).send({ from: userAddress });

    document.getElementById("result").innerText = `Sent ${amount} CatCoin to ${toAddress}`;
    getBalance();
});

// Handle the MetaMask connection button
const connectButton = document.getElementById("connect-button");

connectButton.addEventListener("click", async () => {
    try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = await web3.eth.getCoinbase();
        getBalance();
        console.log("Connected to MetaMask!");
    } catch (error) {
        console.error(error);
    }
});


  
