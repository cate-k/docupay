import React, { useEffect, useState } from "react";
import Web3 from "web3";

import DocuPay from "../abi/DocuPay";
import Navigation from "./sub-components/navigation";
import FeedItem from "./sub-components/feed-item";
import Footer from "./sub-components/footer";

const web3 = new Web3(window.ethereum);

const Feed = () => {
  const [documents, setDocuments] = useState([]);

  // Set the page's title
  document.title = "Feed | DocuPay";

  useEffect(() => {
    const init = async () => {
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        // Fetch the total number of documents created
        await contract.methods.getTotalDocumentsCount().call().then(async (totalDocumentsCreated) => {
          // Fetch each document
          const documents = [];

          for (let docIndex = 0; docIndex < totalDocumentsCreated; docIndex++) {
            // Add one to the document index as documents are retrieved by their ID
            await contract.methods.getDocumentById(docIndex + 1).call().then((document) => {
              documents.push(
                <FeedItem
                  key={documents.length}
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

          setDocuments(documents);
        });
      });
    };

    init();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <div className="content">
        <div className="feed-items">
          {documents}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Feed;