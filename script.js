console.log("Script loaded");

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

web3.eth.getAccounts()
    .then((accounts) => {
        userAddress = accounts[0];
        getBalance();
    })
    .catch((error) => {
        console.error(error);
    });

const contractAddress = "0x99D2f964F1f2996502E5eE1eaFcB09d967fcB224";
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Sent",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "send",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Create an instance of the contract
const catCoin = new web3.eth.Contract(contractABI, contractAddress);

let userAddress;

web3.eth.getAccounts()
    .then((accounts) => {
        userAddress = accounts[0];
        getBalance();
    })
    .catch((error) => {
        console.error(error);
    });

// Get the user's balance of CatCoin and display
async function getBalance() {
    if (!userAddress) {
        console.log("No user address found");
        return;
    }

    console.log("Getting balance for:", userAddress);
    const balance = await catCoin.methods.balanceOf(userAddress).call();
    document.getElementById("balance").innerText = balance.toString();
}

// The submission form to send CatCoin to another address
const form = document.getElementById("send-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!userAddress) {
        console.log("No user address found");
        return;
    }

    const toAddress = event.target.elements.recipient.value;
    const amount = event.target.elements.amount.value;

    console.log("Sending transaction:", toAddress, amount);
    const transaction = await catCoin.methods.send(toAddress, amount).send({ from: userAddress });

    document.getElementById("result").innerText = `Sent ${amount} CatCoin to ${toAddress}`;
    getBalance();
});

// The MetaMask connection button
const connectButton = document.getElementById("connect-metamask-button");

connectButton.addEventListener("click", async () => {
    console.log("Attempting to connect to MetaMask");
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

