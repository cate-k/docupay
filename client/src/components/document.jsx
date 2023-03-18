import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { BigNumber } from "ethers";
import Identicon from "react-hooks-identicons";
import ReactTooltip from "react-tooltip";
import { ChevronUp, ChevronDown, Star, Lock, Eye, MessageSquare, Send } from "react-feather";
import { saveAs } from "file-saver";

import DocuPay from "../abi/DocuPay";
import Navigation from "./sub-components/navigation";
import Comment from "./sub-components/comment";
import Footer from "./sub-components/footer";

const web3 = new Web3(window.ethereum);

const Document = (props) => {
  const [account, setAccount] = useState("0x");
  const [displayName, setDisplayName] = useState("User");
  const [datePublished, setDatePublished] = useState("");
  const [fee, setFee] = useState(0);
  const [votes, setVotes] = useState(0);
  const [favourites, setFavourites] = useState(0);
  const [comments, setComments] = useState([]);
  const [canView, setCanView] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  // Set the page's title
  document.title = props.location.state.title + " | DocuPay";

  useEffect(() => {
    const init = async () => {
      // Initialise the date published, fee, votes, and favourites
      setDatePublished(new Date(parseInt(BigNumber.from(props.location.state.date).toHexString())).toString('DD/mm/yy HH:mm:ss'));
      setFee((parseInt(BigNumber.from(props.location.state.fee).toHexString())));
      setVotes((parseInt(BigNumber.from(props.location.state.votes).toHexString())));
      setFavourites((parseInt(BigNumber.from(props.location.state.favourites).toHexString())));

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
            // Check if the user has access to download the document
            await contract.methods.canView(accounts[0], props.location.state.id).call().then(async (view) => {
              if (view)
                setCanView(true);
            });
          }).then(async () => {
            // Check if the document is upvoted
            await contract.methods.isDocumentUpvoted(props.location.state.id)
              .call({ from: accounts[0] })
              .then(async (isUpvoted) => {
                if (isUpvoted)
                  setIsUpvoted(true);
              });
          }).then(async () => {
            // Check if the document is downvoted
            await contract.methods.isDocumentDownvoted(props.location.state.id)
              .call({ from: accounts[0] })
              .then(async (isDownvoted) => {
                if (isDownvoted)
                  setIsDownvoted(true);
              });
          }).then(async () => {
            // Check if the document is favourited
            await contract.methods.isDocumentFavourited(props.location.state.id)
              .call({ from: accounts[0] })
              .then(async (isFavourited) => {
                if (isFavourited)
                  setIsFavourited(true);
              });
          }).then(async () => {
            // Load the comments
            await contract.methods.getCommentCount(props.location.state.id).call().then(async (totalComments) => {
              const comments = [];

              for (let commentIndex = 0; commentIndex < totalComments; commentIndex++) {
                await contract.methods.getCommentOnDocument(props.location.state.id, commentIndex).call().then(async (commentIndexOnDocument) => {
                  await contract.methods.getCommentById(commentIndexOnDocument - 1).call().then(async (comment) => {
                    comments.push(
                      <Comment
                        key={comments.length}
                        docId={props.location.state.id}
                        commentId={comment.commentId}
                        commenter={comment.commenter}
                        date={comment.date}
                        commentMsg={comment.commentMsg}
                        likes={comment.likes}
                      />
                    );

                    setComments(comments);
                  });
                });
              }
            });
          });
        });
      });
    };

    init();
  }, []);

  const purchaseDocument = async () => {
    // Purchase the document
    window.ethereum.enable().then(async () => {
      const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
      contract.setProvider(web3.currentProvider);

      await contract.methods.purchaseDocument(props.location.state.id)
        .send({ from: account, gas: 5000000 })
        .then(() => {
          // Send the ETH to the uploader
          web3.eth.sendTransaction({
            from: account,
            to: props.location.state.uploader,
            value: web3.utils.toWei(fee.toString(), 'gwei')
          });
        });
    });
  };

  const saveDocument = () => {
    saveAs(props.location.state.file, props.location.state.title);
  };

  const upvoteDocument = async () => {
    if (account === props.location.state.uploader) {
      alert("You cannot upvote your own document.");
    } else {
      // Upvote the document
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        await contract.methods.upvoteDocument(props.location.state.id)
          .send({ from: account, gas: 5000000 })
          .then(() => {
            setIsUpvoted(true);
          });
      });
    }
  };

  const downvoteDocument = async () => {
    if (account === props.location.state.uploader) {
      alert("You cannot downvote your own document.");
    } else if (votes === 0) {
      alert("Document cannot be downvoted further.");
    } else {
      // Downvote the document
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        await contract.methods.downvoteDocument(props.location.state.id)
          .send({ from: account, gas: 5000000 })
          .then(() => {
            setIsDownvoted(true);
          });
      });
    }
  };

  const removeVoteFromDocument = async () => {
    // Ensure the document has been voted on and the voter is not the uploader
    if ((isUpvoted || isDownvoted) && (account.toLowerCase() !== props.location.state.uploader.toLowerCase())) {
      // Remove the vote from the document
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        await contract.methods.removeVoteFromDocument(props.location.state.id)
          .send({ from: account, gas: 5000000 })
          .then(() => {
            if (isUpvoted)
              setIsUpvoted(false);
            else if (isDownvoted)
              setIsDownvoted(false);
          });
      });
    }
  };

  const favouriteDocument = async () => {
    // Favourite the document
    window.ethereum.enable().then(async () => {
      const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
      contract.setProvider(web3.currentProvider);

      await contract.methods.favouriteDocument(props.location.state.id)
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

      await contract.methods.unfavouriteDocument(props.location.state.id)
        .send({ from: account, gas: 5000000 })
        .then(() => {
          setIsFavourited(false);
        });
    });
  };

  const sendComment = async () => {
    // Validate the user input before sending
    if (document.getElementById("commentMsg").value.length === 0)
      alert("Comment cannot be left empty.");
    else if (document.getElementById("commentMsg").value.length > 500)
      alert("Comment cannot be over 500 characters.");
    else {
      // Capture the time the comment is sent
      const date = (new Date()).getTime();

      // Send comment
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        await contract.methods
          .sendComment(
            props.location.state.id,
            date,
            document.getElementById("commentMsg").value
          ).send({ from: account, gas: 5000000 });
      });
    }
  };

  // Display a purchase button if the user hasn't purchased the document yet
  if (canView) {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <div className="document">
            <div className="left-col">
              <ChevronUp
                className={"document-icon vote " + (isUpvoted ? "voted" : "")}
                onClick={(isUpvoted) ? removeVoteFromDocument : upvoteDocument}
                data-tip="This document is as described"
              />
              <p>{votes}</p>
              <ChevronDown
                className={"document-icon vote " + (isDownvoted ? "voted" : "")}
                onClick={(isDownvoted) ? removeVoteFromDocument : downvoteDocument}
                data-tip="This document is not as described"
              />
              <br />

              <Star
                className={"document-icon star " + (isFavourited ? "starred" : "")}
                onClick={(isFavourited) ? unfavouriteDocument : favouriteDocument}
              />
              <p>{favourites}</p>
            </div>

            <div className="right-col">
              <h1>{props.location.state.title}</h1>

              <p>
                By
                <Link
                  data-tip={props.location.state.uploader}
                  to={{
                    pathname: "/profile/" + props.location.state.uploader,
                    state: {
                      uploader: props.location.state.uploader
                    }
                  }}
                >
                  <Identicon className="feed-avatar" string={props.location.state.uploader} size={40} />
                  {displayName}
                </Link>
              </p>

              <p className="date">
                <span className="bold">Posted: </span>
                {datePublished.substring(datePublished.indexOf(' ') + 1, datePublished.indexOf(' ') + 12)}
              </p>

              <button className="view-btn animated-btn" onClick={saveDocument}>
                <Eye className="btn-icon" />
                <span>Download document</span>
              </button>

              <p className="description">{props.location.state.description}</p>

              <div>
                <div className="heading">
                  <MessageSquare className="icon" />
                  Comments
                </div>
                <div className="input">
                  <Identicon className="comment-avatar" string={account} size={35} />
                  <textarea
                    id="commentMsg"
                    className="message"
                    type="text"
                    placeholder="Write a comment... (Max 500 characters)"
                  />
                  <Send
                    className="send-icon"
                    data-tip="Warning: Once sent, you cannot edit this comment!"
                    onClick={sendComment}
                  />
                </div>
              </div>

              <div>{comments}</div>
            </div>
          </div>
          <ReactTooltip />
        </div>

        <Footer />
      </div>
    );
  } else {
    return (
      <div className="page">
        <Navigation />

        <div className="content">
          <div className="document">
            <div className="left-col">
              <ChevronUp
                className={"document-icon vote " + (isUpvoted ? "voted" : "")}
                onClick={(isUpvoted) ? removeVoteFromDocument : upvoteDocument}
                data-tip="This document is as described"
              />
              <p>{votes}</p>
              <ChevronDown
                className={"document-icon vote " + (isDownvoted ? "voted" : "")}
                onClick={(isDownvoted) ? removeVoteFromDocument : downvoteDocument}
                data-tip="This document is not as described"
              />
              <br />

              <Star
                className={"document-icon star " + (isFavourited ? "starred" : "")}
                onClick={(isFavourited) ? unfavouriteDocument : favouriteDocument}
              />
              <p>{favourites}</p>
            </div>

            <div className="right-col">
              <h1>{props.location.state.title}</h1>

              <p>
                By
                <Link
                  data-tip={props.location.state.uploader}
                  to={{
                    pathname: "/profile/" + props.location.state.uploader,
                    state: {
                      uploader: props.location.state.uploader
                    }
                  }}
                >
                  <Identicon className="feed-avatar" string={props.location.state.uploader} size={40} />
                  {displayName}
                </Link>
              </p>

              <p className="date">
                <span className="bold">Posted: </span>
                {datePublished.substring(datePublished.indexOf(' ') + 1, datePublished.indexOf(' ') + 12)}
              </p>

              <button className="view-btn animated-btn" onClick={purchaseDocument}>
                <Lock className="btn-icon" />
                <span>Purchase document for {fee} gwei</span>
              </button>

              <p className="description">{props.location.state.description}</p>

              <div>
                <div className="heading">
                  <MessageSquare className="icon" />
                  Comments
                </div>
                <div className="input">
                  <Identicon className="comment-avatar" string={account} size={35} />
                  <textarea
                    id="commentMsg"
                    className="message"
                    type="text"
                    placeholder="Write a comment... (Max 500 characters)"
                  />
                  <Send
                    className="send-icon"
                    data-tip="Warning: Once sent, you cannot edit this comment!"
                    onClick={sendComment}
                  />
                </div>
              </div>

              <div>{comments}</div>
            </div>
          </div>
          <ReactTooltip />
        </div>

        <Footer />
      </div>
    );
  }
}

export default Document;