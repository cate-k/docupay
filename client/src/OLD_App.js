import React, { Component } from "react";
import Web3 from "web3";
import { Document } from 'react-pdf';
import DocuPay from "./contracts/DocuPay.json";

import "./styles/App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      docupayHash: "",
      contract: null,
      web3: null,
      buffer: null,
      account: null
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please use a browser with an Ethereum wallet.");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    // Load the user's MetaMask account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = DocuPay.networks[networkId];

    if (networkData) {
      const contract = new web3.eth.Contract(DocuPay.abi, networkData.address);
      this.setState({ contract });

      const docupayHash = await contract.methods.getHash().call();
      this.setState({ docupayHash: docupayHash[0].hash });
    } else {
      window.alert("Smart contract is not deployed to detected network.");
    }
  }

  captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    console.log("Sending file to IPFS...");

    let data = this.state.buffer;
    console.log("Submitting:", data);

    if (data) {
      try {
        const postResponse = await ipfs.add(data);
        console.log("postResponse", postResponse);
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      alert("The file was not able to successfully submit. Please try again!");
      console.log("Error: No data to submit.");
    }
  }

  render() {
    return (
      <div>
        <Document src={`https://ipfs.infura.io/ipfs/${this.state.docupayHash}`} />
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
        <p>{this.state.docupayHash}</p>
      </div>
    );
  }
}

export default App;
