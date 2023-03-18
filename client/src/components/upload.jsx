import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Buffer } from "buffer";
import { create as ipfsClient } from "ipfs-http-client";
import ReactTooltip from "react-tooltip";
import { Edit } from "react-feather";

import DocuPay from "../abi/DocuPay.json";
import Navigation from "./sub-components/navigation";
import Footer from "./sub-components/footer";

const web3 = new Web3(window.ethereum);

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecret = process.env.REACT_APP_API_KEY_SECRET;
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Upload = () => {
  const [account, setAccount] = useState("0x");
  const [file, setFile] = useState([]);

  // Set the page's title
  document.title = "Upload a Document | DocuPay";

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

  const captureFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    setFile(event.target.files[0]);
  };

  const validateInput = async () => {
    // Check that the document has a file uploaded
    if (file.type === "") {
      alert("No file has been chosen.");
      return false;
    } else if (file.type !== "application/pdf") {
      alert("File must be a PDF.");
      return false;
    }

    // Validate that the title is not empty and is under 25 chars
    if (document.getElementById("title").value.length === 0) {
      alert("Title cannot be left empty.");
      return false;
    } else if (document.getElementById("title").value.length > 25) {
      alert("Title cannot be over 25 characters.");
      return false;
    }

    // Check that the description is not blank and is under 1000 chars
    if (document.getElementById("description").value.length === 0) {
      alert("Description cannot be left empty.");
      return false;
    } else if (document.getElementById("description").value.length > 1000) {
      alert("Description cannot be over 1000 characters.");
      return false;
    }

    // If the document has passed all checks, set its validity to true
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the user input before creating document
    const isValid = await validateInput();

    if (account !== "0x" && isValid === true) {
      alert("Please wait while your document is being created. You will receive a MetaMask transaction notification shortly. Once you receive the transaction confirmation notification from MetaMask, you can view your document in the feed or through your profile!");

      // Initialise the date
      const date = (new Date()).getTime();

      // Upload file to IPFS
      const uploadedFile = await client.add(file);
      const pathToFile = "https://ipfs.io/ipfs/" + uploadedFile.path;

      // Create a post
      window.ethereum.enable().then(() => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        contract.methods.uploadDocument(
          document.getElementById("title").value,
          date,
          document.getElementById("description").value,
          document.getElementById("fee").value,
          pathToFile
        )
        .send({ from: account, gas: 5000000 });
      });
    }
  };

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <div className="upload">
          <div className="heading">
            <Edit className="icon" />
            <h1>Upload a Document</h1>
          </div>
          <form className="upload-form" onSubmit={handleSubmit}>
            <label className="upload-heading">Title</label>
            <input type="text" id="title" className="upload-field" placeholder="Add a title... (Max 25 characters)" />
            <br />

            <label className="upload-heading">Fee</label>
            <input type="number" id="fee" className="upload-field" placeholder="0 gwei" />
            <br />

            <label className="upload-heading">Description</label>
            <textarea type="text" id="description" className="upload-field" placeholder="What is your document about? (Max 1000 characters)" />
            <br />

            <label className="upload-heading">Choose a PDF File</label>
            <input type="file" className="upload-field file" accept=".pdf" onChange={captureFile} />
            <br />

            <button type="submit" className="upload-btn animated-btn" data-tip="Warning: Once published, you cannot edit or delete this document!">
              <span>Publish</span>
            </button>
          </form>
        </div>
        <ReactTooltip />
      </div>

      <Footer />
    </div>
  );
}

export default Upload;