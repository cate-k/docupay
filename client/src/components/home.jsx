import React from "react";
import { Link } from "react-router-dom";
import { Send, Cpu } from "react-feather";

import Footer from "./sub-components/footer";

const Home = () => {
  // Set the page's title
  document.title = "Home | DocuPay";

  return (
    <div className="page">
      <div className="header">
        <img
          className="docupay-logo"
          src={require("../styles/images/logo.png")}
          alt="DocuPay"
        />

        <Link to="/feed">
          <button className="sign-in-btn">
            <img
              className="metamask-logo"
              src={require("../styles/images/metamask.png")}
              alt="MetaMask"
            />
            <span>Sign in</span>
          </button>
        </Link>
      </div>

      <div className="content">
        <div className="home-row">
          <div className="home-col-left">
            <img
              className="home-graphics"
              src={require("../styles/images/logo.png")}
              alt="DocuPay"
            />
          </div>
          <div className="home-col-right">
            <h1>Welcome to DocuPay!</h1>
            <p>DocuPay is a DApp backed by a smart contract where users can quickly share PDF files and get paid in Ethereum when someone purchases their file to download.</p>
          </div>
        </div>

        <div className="home-row">
          <div className="home-col-left">
            <Send className="home-graphics" />
          </div>
          <div className="home-col-right">
            <h1>Start Today</h1>
            <p>Start using DocuPay by signing in with MetaMask! An account will automatically be created for you by using your public address.</p>
          </div>
        </div>

        <div className="home-row">
          <div className="home-col-left">
            <Cpu className="home-graphics" />
          </div>
          <div className="home-col-right">
            <h1 className="heading">Tech Behind DocuPay</h1>
            <p>
              DocuPay is built with Solidity, ReactJS, Truffle, Ganache, and Infura, and is deployed on the Goerli testnet. It uses IPFS to store uploaded PDF files.
            </p>
            <p>You can find the project's repository <a href="https://github.com/cate-k/docupay" target="_blank" rel="noopener noreferrer">here</a>.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;