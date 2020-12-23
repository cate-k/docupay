import React, { Component } from "react";
import DocuPay from "./contracts/DocuPay.json";

import "./styles/App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return <div className="app"></div>;
  }
}

export default App;
