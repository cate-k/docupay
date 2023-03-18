import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { BigNumber } from "ethers";
import Identicon from "react-hooks-identicons";
import { Check, Edit2, X, Award, Book } from "react-feather";

import DocuPay from "../abi/DocuPay";
import Navigation from "./sub-components/navigation";
import FeedItem from "./sub-components/feed-item";
import Footer from "./sub-components/footer";

const web3 = new Web3(window.ethereum);

const Profile = (props) => {
  const [account, setAccount] = useState("0x");
  const [displayName, setDisplayName] = useState("User");
  const [reputation, setReputation] = useState(0);
  const [documentsUploaded, setDocumentsUploaded] = useState([]);
  const [toggleEditName, setToggleEditName] = useState(false);

  // Set the page's title
  document.title = displayName + " | DocuPay";

  useEffect(() => {
    const init = async () => {
      window.ethereum.enable().then(() => {
        web3.eth.getAccounts().then(async (accounts) => {
          setAccount(accounts[0]);

          const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
          contract.setProvider(web3.currentProvider);

          // Fetch the user's display name
          await contract.methods.getName(props.location.state.uploader).call().then(async (name) => {
            if (name !== "")
              setDisplayName(name);
          }).then(async () => {
            // Fetch the user's reputation
            await contract.methods.getReputation(props.location.state.uploader).call().then(async (reputation) => {
              setReputation(parseInt(BigNumber.from(reputation).toHexString()));
            });
          }).then(async () => {
            // Fetch the total number of documents uploaded
            await contract.methods.getDocumentsUploadedCount(props.location.state.uploader).call().then(async (totalDocumentsUploaded) => {
              // Fetch each document uploaded
              const documentsUploaded = [];

              for (let docIndex = 0; docIndex < totalDocumentsUploaded; docIndex++) {
                // Retrieve the ID of the document uploaded
                await contract.methods.getDocumentUploaded(props.location.state.uploader, docIndex).call().then(async (documentId) => {
                  await contract.methods.getDocumentById(documentId - 1).call().then((document) => {
                    documentsUploaded.push(
                      <FeedItem
                        key={documentsUploaded.length}
                        id={document.docId}
                        uploader={document.uploader}
                        title={document.title}
                        date={document.date}
                        description={document.description}
                        fee={document.fee}
                        file={document.file}
                        votes={document.votes}
                        favourites={document.favourites}
                      />
                    );
                  });
                });
              }

              setDocumentsUploaded(documentsUploaded);
            });
          });
        });
      });
    };

    init();
  }, []);

  const editDisplayName = () => {
    setToggleEditName(true);
  };

  const exitEditDisplayName = () => {
    setToggleEditName(false);
  };

  const saveDisplayName = async () => {
    // Prevent the user from going under or over the character limit for the display name
    if (document.getElementById("displayName").value.length > 0 && document.getElementById("displayName").value.length <= 35) {
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);
  
        await contract.methods.changeName(document.getElementById("displayName").value)
          .send({ from: account, gas: 5000000 })
          .then(() => {
            setDisplayName(document.getElementById("displayName").value);
          });
      });
    } else if (document.getElementById("displayName").value.length === 0) {
      alert("Display name cannot be left empty.");
    } else if (document.getElementById("displayName").value.length > 35) {
      alert("Display name cannot be over 35 characters.");
    }
  };

  // Check if this is the user's profile, and allow them to edit their display name if so
  if (account === props.location.state.uploader) {
    // Check if the user has clicked on the edit display name button
    if (toggleEditName === true) {
      return (
        <div className="page">
          <Navigation />

          <div className="content">
            <div className="profile">
              <div className="profile-info">
                <Identicon className="avatar" string={props.location.state.uploader} size={200} />

                <div className="profile-text">
                  <h1 className="address">{props.location.state.uploader}</h1>
                  <p className="uploader-name">
                    <input
                      id="displayName"
                      type="text"
                      placeholder={displayName}
                    />
                    <X className="edit-icon" onClick={exitEditDisplayName} />
                    <Check className="edit-icon" onClick={saveDisplayName} />
                  </p>
                  <p className="reputation">
                    <Award className="icon" />
                    {reputation} reputation
                  </p>
                </div>
              </div>

              <div className="heading">
                <Book className="icon" />
                Documents Uploaded
              </div>
              <div className="feed-items">
                {documentsUploaded}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      );
    } else {
      return (
        <div className="page">
          <Navigation />

          <div className="content">
            <div className="profile">
              <div className="profile-info">
                <Identicon className="avatar" string={props.location.state.uploader} size={200} />

                <div className="profile-text">
                  <h1 className="address">{props.location.state.uploader}</h1>
                  <p className="uploader-name">
                    <span>{displayName}</span>
                    <Edit2 className="edit-icon" onClick={editDisplayName} />
                  </p>
                  <p className="reputation">
                    <Award className="icon" />
                    {reputation} reputation
                  </p>
                </div>
              </div>

              <div className="heading">
                <Book className="icon" />
                Documents Uploaded
              </div>
              <div className="feed-items">
                {documentsUploaded}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      );
    }
  } else {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <div className="profile">
            <div className="profile-info">
              <Identicon className="avatar" string={props.location.state.uploader} size={200} />

              <div className="profile-text">
                <h1 className="address">{props.location.state.uploader}</h1>
                <p className="display-name">{displayName}</p>
                <p className="reputation">
                  <Award className="icon" />
                  {reputation} reputation
                </p>
              </div>
            </div>

            <div className="heading">
              <Book className="icon" />
              Documents Uploaded
            </div>
            <div className="feed-items">
              {documentsUploaded}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Profile;