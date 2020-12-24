import React, { Component } from "react";
import DocuPay from "./contracts/DocuPay.json";
import Web3 from "web3";
import web3 from "./web3";
import ipfs from "./ipfs";
import storehash from "./storehash";

import "./styles/App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docupayHash: null,
      buffer: "",
      ethAddress: "",
      account: null
    };
  }
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchain();
  }

  // Detect web3 on the user's browser
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please switch to a browser that has an Ethereum wallet, such as MetaMask.");
    }
  }

  async loadBlockchain() {
    const web3 = window.web3;

    // Retrieve the user's MetaMask account address
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = DocuPay.networks[networkId];

    // Create a new contract instance
    if (networkData) {
      const contract = new web3.eth.Contract(DocuPay.abi, networkData.address);
      this.setState({ contract });

      const docupayHash = await contract.methods.getHash().call();
      this.setState({ docupayHash });

      contract.deploy({
        data: "0xaeb4a02e07DB178ADa5D635f23e4Fb424c40eC25",
        arguments: [
          document.getElementById("title").value,
          document.getElementById("price").value,
          document.getElementById("description").value,
          JSON.stringify(docupayHash)
        ]
      }).send({
        from: "0x31AD83536f0fD14ed34438EBbaFD7a95CF346686",
        gas: 1500000,
        gasPrice: "30000000000000"
      })
      .then(function(newContractInstance){
        console.log(newContractInstance.options.address)
      });
    }
  }

  // Capture and read file when user uploads it
  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];

    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async (reader) => {
    // Convert file to buffer so that it can be uploaded to IPFS
    const buffer = await Buffer.from(reader.result);
    this.setState({buffer});
  };

  onSubmit = async (event) => {
    event.preventDefault();

    // Take the user's MetaMask address
    const accounts = await web3.eth.getAccounts();
    alert("Please wait a few moments while your file is being sent to IPFS from MetaMask account: " + accounts[0]);

    // To use the contract's methods
    this.DocuPay = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
    this.DocuPay.setProvider(web3.currentProvider);

    // Retrieve the contract address from storehash.js
    const ethAddress = await storehash.options.address;
    this.setState({ethAddress});
    
    // Save document to IPFS, return its hash, and set it to state
    await ipfs.add(this.state.buffer, (err, docupayHash) => {
      this.setState({ docupayHash: docupayHash[0].hash });
      console.log("IPFS File", err, docupayHash);
      alert("Your file has been successfully uploaded to IPFS! You can now view your file using the button below.");
    });
  };

  render() {
    return (
      <div>
        <div className="header">
          <a href="/">
            <img src={require("./media/logo.png")} alt="DocuPay" className="logo" />
          </a>
          <div className="header-text">
            <span className="address">{this.state.account}</span>
          </div>
        </div>

        <div className="text-wrapper">
          <p className="heading">Publish a Document</p>

          <form onSubmit={this.onSubmit}>
            <p>Title</p>
            <input type="text" id="title" className="form-input" placeholder="Write title..." />
            <br />
            <p>Price</p>
            <input type="number" id="price" className="form-input" placeholder="0" />
            <br />
            <p>Description</p>
            <input type="text" id="description" className="form-input" placeholder="Write description..." />
            <br />
            <p>Choose a PDF document to upload</p>
            <br />
            <input type="file" onChange={this.captureFile} className="input-file" />
            <br />

            <p>
              <button type="submit">Publish</button>
            </p>
          </form>

          <a href={`https://ipfs.infura.io/ipfs/${this.state.docupayHash}`} className="link-button" target="_blank" rel="noopener noreferrer">View your file</a>
        </div>
      </div>
    );
  }
}

export default App;