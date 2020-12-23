import web3 from './web3';

const address = '0xaeb4a02e07DB178ADa5D635f23e4Fb424c40eC25';

const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "getHash",
    "outputs": [
      {
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "setHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default new web3.eth.Contract(abi, address);