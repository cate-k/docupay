import React, { Component } from "react";
import { Document, Page } from 'react-pdf';
import web3 from "./web3";
import ipfs from "./ipfs";
import storehash from "./storehash";

import "./styles/App.css";

class App extends Component {
  state = {
    docupayHash: null,
    buffer: "",
    ethAddress: "",
  };
   
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
    console.log("Sending from MetaMask account: " + accounts[0]);

    // Retrieve the contract address from storehash.js
    const ethAddress= await storehash.options.address;
    this.setState({ethAddress});

    // Save document to IPFS, return its hash, and set it to state
    await ipfs.add(this.state.buffer, (err, docupayHash) => {
      console.log(err, docupayHash);
      this.setState({ docupayHash: docupayHash[0].hash });
    })
  };

  render() {
    return (
      <div className="app">
        <h3> Choose file to send to IPFS </h3>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <button type="submit">Submit</button>
        </form>

        <Document src={`https://ipfs.infura.io/ipfs/${this.state.docupayHash}`}>
          <Page pageNumber={1} />
        </Document>

        <a href={`https://ipfs.infura.io/ipfs/${this.state.docupayHash}`}>Click to download the file</a>

        <p>IPFS Hash: {this.state.docupayHash}</p>
      </div>
    );
  }
}

export default App;