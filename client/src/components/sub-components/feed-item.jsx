import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { BigNumber } from "ethers";
import Identicon from "react-hooks-identicons";
import ReactTooltip from "react-tooltip";
import { Star, Eye } from "react-feather";

import DocuPay from "../../abi/DocuPay.json";

const web3 = new Web3(window.ethereum);

const FeedItem = (props) => {
  const [account, setAccount] = useState("0x");
  const [votes, setVotes] = useState(0);
  const [favourites, setFavourites] = useState(0);
  const [displayName, setDisplayName] = useState("User");
  const [datePublished, setDatePublished] = useState("");
  const [canView, setCanView] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Convert the votes and favourites to readable numbers
      setVotes(parseInt(BigNumber.from(props.votes).toHexString()));
      setFavourites(parseInt(BigNumber.from(props.favourites).toHexString()));

      // Initialise the date published
      setDatePublished(new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss'));

      window.ethereum.enable().then(() => {
        web3.eth.getAccounts().then(async (accounts) => {
          setAccount(accounts[0]);

          const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
          contract.setProvider(web3.currentProvider);

          // Initialise the display name
          await contract.methods.getName(props.uploader).call().then(async (name) => {
            if (name !== "")
              setDisplayName(name);
          }).then(async () => {
            // Check if the user has access to the document
            await contract.methods.canView(accounts[0], props.id).call().then(async (view) => {
              if (view)
                setCanView(true);
            });
          }).then(async () => {
            // Check if the user has favourited the document
            await contract.methods.isDocumentFavourited(props.id)
              .call({ from: accounts[0] })
              .then(async (favourited) => {
                if (favourited)
                  setIsFavourited(true);
              });
          });
        });
      });
    };

    init();
  }, []);

  const favouriteDocument = async () => {
    // Favourite the document
    window.ethereum.enable().then(async () => {
      const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
      contract.setProvider(web3.currentProvider);

      await contract.methods.favouriteDocument(props.id)
        .send({ from: account, gas: 5000000 })
        .then(() => {
          setIsFavourited(true);
        });
    });
  };

  const unfavouriteDocument = async () => {
    // Unfavourite the document
    window.ethereum.enable().then(async () => {
      const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
      contract.setProvider(web3.currentProvider);

      await contract.methods.unfavouriteDocument(props.id)
        .send({ from: account, gas: 5000000 })
        .then(() => {
          setIsFavourited(false);
        });
    });
  };

  return (
    <div>
      <div className="feed-item">
        <div className="left-col">
          <p>{votes}</p>
          <p className="feed-icon">votes</p>

          <Star
            className={"feed-icon star " + (isFavourited ? "starred" : "")}
            onClick={(isFavourited) ? unfavouriteDocument : favouriteDocument}
          />
          <p>{favourites}</p>
        </div>

        <div className="right-col">
          <h1>{props.title}</h1>
          <p className="text-preview">{props.description}</p>
          <p>
            By
            <Link
              data-tip={props.uploader}
              to={{
                pathname: "/profile/" + props.uploader,
                state: {
                  uploader: props.uploader
                }
              }}
            >
              <Identicon className="feed-avatar" string={props.uploader} size={45} />
              {displayName}
            </Link>
          </p>
          <p className="date">
            <span>Posted: </span>
            {datePublished.substring(datePublished.indexOf(' ') + 1, datePublished.indexOf(' ') + 12)}
          </p>
          <Link
            to={{
              pathname: "/doc/" + props.id + "/" + props.title,
              state: {
                id: props.id,
                uploader: props.uploader,
                title: props.title,
                date: props.date,
                description: props.description,
                fee: props.fee,
                file: props.file,
                votes: props.votes,
                favourites: props.favourites
              }
            }}
          >
            <button className="view-btn animated-btn">
              <Eye className={"btn-icon " + (canView ? "" : "hidden")} />
              <span>View document</span>
            </button>
          </Link>
        </div>
      </div>

      <hr className="feed-divider" />
      <ReactTooltip />
    </div>
  );
}

export default FeedItem;