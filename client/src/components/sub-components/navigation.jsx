import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Link } from "react-router-dom";
import Identicon from "react-hooks-identicons";
import ReactTooltip from "react-tooltip";
import { BookOpen, Bookmark, PlusCircle } from "react-feather";

const web3 = new Web3(window.ethereum);

const Navigation = () => {
  const [account, setAccount] = useState("0x");

  useEffect(() => {
    const init = async () => {
      window.ethereum.enable().then(() => {
        web3.eth.getAccounts().then(async (accounts) => {
          setAccount(accounts[0]);
        });
      });
    };

    init();
  }, []);

  return (
    <div className="navigation">
      <div className="nav-header">
        <Link to="/home">
          <img
            className="logo first-link"
            src={require("../../styles/images/logo.png")}
            alt="DocuPay"
          />
        </Link>

        <Link to="/feed" data-tip="Feed">
          <BookOpen className="link" />
        </Link>

        <Link to="/library" data-tip="Library">
          <Bookmark className="link" />
        </Link>

        <Link to="/upload" data-tip="Upload">
          <PlusCircle className="link" />
        </Link>

        <Link
          to={{
            pathname: "/profile/" + account,
            state: {
              uploader: account
            }
          }}
        >
          <Identicon className="avatar" string={account} size={45} />
        </Link>

        <ReactTooltip />
      </div>
    </div>
  );
}

export default Navigation;