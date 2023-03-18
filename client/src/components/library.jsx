import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Star, Eye } from "react-feather";

import DocuPay from "../abi/DocuPay";
import Navigation from "./sub-components/navigation";
import FeedItem from "./sub-components/feed-item";
import Footer from "./sub-components/footer";

const web3 = new Web3(window.ethereum);

const Library = () => {
  const [documentsFavourited, setDocumentsFavourited] = useState([]);
  const [documentsPurchased, setDocumentsPurchased] = useState([]);

  // Set the page's title
  document.title = "Library | DocuPay";

  useEffect(() => {
    const init = async () => {
      window.ethereum.enable().then(async () => {
        web3.eth.getAccounts().then(async (accounts) => {
          const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
          contract.setProvider(web3.currentProvider);

          // Fetch the total number of documents favourited
          await contract.methods.getDocumentsFavouritedCount(accounts[0]).call()
            .then(async (totalDocumentsFavourited) => {
              // Fetch each document favourited
              const documentsFavourited = [];

              for (let docIndex = 0; docIndex < totalDocumentsFavourited; docIndex++) {
                await contract.methods.getDocumentById(docIndex + 1).call().then((document) => {
                  documentsFavourited.push(
                    <FeedItem
                      key={documentsFavourited.length}
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
              }

              setDocumentsFavourited(documentsFavourited);
            });

          // Fetch the total number of documents purchased
          await contract.methods.getDocumentsPurchasedCount(accounts[0]).call()
            .then(async (totalDocumentsPurchased) => {
              // Fetch each document purchased
              const documentsPurchased = [];

              for (let docIndex = 0; docIndex < totalDocumentsPurchased; docIndex++) {
                await contract.methods.getDocumentById(docIndex + 1).call().then((document) => {
                  documentsPurchased.push(
                    <FeedItem
                      key={documentsPurchased.length}
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
              }

              setDocumentsPurchased(documentsPurchased);
            });
        });
      });
    };

    init();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <div className="library">
          <div className="heading">
            <Star className="icon" />
            Favourited Documents
          </div>
          <div className="feed-items">
            {documentsFavourited}
          </div>

          <div className="heading last">
            <Eye className="icon" />
            Purchased Documents
          </div>
          <div className="feed-items">
            {documentsPurchased}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Library;