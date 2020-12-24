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
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = DocuPay.networks[networkId];

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

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchain();
  }
   
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
    console.log("Sending file to IPFS from MetaMask account: " + accounts[0]);

    // To use the contract's methods
    this.DocuPay = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
    this.DocuPay.setProvider(web3.currentProvider);

    // Retrieve the contract address from storehash.js
    const ethAddress = await storehash.options.address;
    this.setState({ethAddress});
    
    // Save document to IPFS, return its hash, and set it to state
    await ipfs.add(this.state.buffer, (err, docupayHash) => {
      console.log("IPFS File",err, docupayHash);
      this.setState({ docupayHash: docupayHash[0].hash });
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
            <input type="file" onChange={this.captureFile} className="input-file" />

            <button type="submit">Publish</button>
          </form>
        </div>

        <div className="text-wrapper">
          <p className="heading">Feed</p>
        </div>
      </div>
      // <a href={`https://ipfs.infura.io/ipfs/${this.state.docupayHash}`}>Click to download the file</a>
    );
  }
}

export default App;