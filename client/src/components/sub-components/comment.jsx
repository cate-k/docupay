import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { BigNumber } from "ethers";
import Identicon from "react-hooks-identicons";
import ReactTooltip from "react-tooltip";
import { Info, ThumbsUp, Trash } from "react-feather";

import DocuPay from "../../abi/DocuPay";

const web3 = new Web3(window.ethereum);

const Comment = (props) => {
  const [account, setAccount] = useState("0x");
  const [displayName, setDisplayName] = useState("User");
  const [datePublished, setDatePublished] = useState("");
  const [likes, setLikes] = useState(0);
  const [purchasedDocumentStatus, setPurchasedDocumentStatus] = useState("Commenter did not purchase this document");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Initialise the date published and the likes
      setDatePublished(new Date(parseInt(BigNumber.from(props.date).toHexString())).toString('DD/mm/yy HH:mm:ss'));
      setLikes(parseInt(BigNumber.from(props.likes).toHexString()));

      window.ethereum.enable().then(() => {
        web3.eth.getAccounts().then(async (accounts) => {
          setAccount(accounts[0]);

          const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
          contract.setProvider(web3.currentProvider);

          // Retrieve the user's display name
          await contract.methods.getName(props.commenter).call().then(async (name) => {
            if (name !== "")
              setDisplayName(name);
          }).then(async () => {
            // Check if the user has purchased this document
            await contract.methods.canView(props.commenter, props.docId).call().then(async (view) => {
              if (view)
                setPurchasedDocumentStatus("Commenter purchased this document");
            });
          }).then(async () => {
            // Check if the comment is liked
            await contract.methods.isCommentLiked(props.commentId).call().then(async (isLiked) => {
              if (isLiked)
                setIsLiked(true);
            });
          });
        });
      });
    };

    init();
  }, []);

  const likeComment = async () => {
    // Ensure the voter is not the commenter
    if (props.commenter === account) {
      alert("You cannot like your own comment.");
    } else {
      // Like the comment
      window.ethereum.enable().then(async () => {
        const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
        contract.setProvider(web3.currentProvider);

        await contract.methods.likeComment(props.commentId)
          .send({ from: account, gas: 5000000 })
          .then(() => {
            setIsLiked(true);
          });
      });
    }
  }

  const removeLikeFromComment = async () => {
    // Remove the like
    window.ethereum.enable().then(async () => {
      const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
      contract.setProvider(web3.currentProvider);

      await contract.methods.removeLikeFromComment(props.commentId)
        .send({ from: account, gas: 5000000 })
        .then(() => {
          setIsLiked(false);
        });
    });
  }

  const deleteComment = async () => {
    // Delete the comment
    window.ethereum.enable().then(async () => {
      const contract = new web3.eth.Contract(DocuPay.abi, DocuPay.address);
      contract.setProvider(web3.currentProvider);

      await contract.methods.deleteComment(props.docId, props.commentId).send({ from: account, gas: 5000000 });
    });
  }

  // Display an option to delete the comment if the user is the commenter
  if (account === props.commenter) {
    return (
      <div className="comment">
        <Link
          className="commenter"
          data-tip={props.commenter}
          to={{
            pathname: "/profile/" + props.commenter,
            state: {
              uploader: props.commenter
            }
          }}
        >
          <Identicon className="comment-avatar" string={props.commenter} size={35} />
          <p>{displayName}</p>
        </Link>

        <div className="comment-info">
          <div className="commentMsg">
            <p>{props.commentMsg}</p>
          </div>

          <p className="date">
            <span className="bold">Posted: </span>
            {datePublished.substring(datePublished.indexOf(' ') + 1, datePublished.indexOf(' ') + 12)}
          </p>

          <div className="purchased-document-status">
            <Info className="info-icon" size={18} />
            <p>{purchasedDocumentStatus}</p>
          </div>

          <div className="comment-buttons">
            <ThumbsUp
              className={"like " + (isLiked ? "liked" : "")}
              onClick={(isLiked) ? removeLikeFromComment : likeComment}
              data-tip="This comment is helpful"
            />
            <p>{likes}</p>

            <Trash
              className="delete-icon"
              onClick={deleteComment}
              data-tip="Warning: This will permanently delete your comment!"
            />
          </div>

          <ReactTooltip />
        </div>
      </div>
    );
  } else {
    return (
      <div className="comment">
        <Link
          className="commenter"
          data-tip={props.commenter}
          to={{
            pathname: "/profile/" + props.commenter,
            state: {
              uploader: props.commenter
            }
          }}
        >
          <Identicon className="comment-avatar" string={props.commenter} size={35} />
          <p>{displayName}</p>
        </Link>

        <div className="comment-info">
          <div className="commentMsg">
            <p>{props.commentMsg}</p>
          </div>

          <p className="date">
            <span className="bold">Posted: </span>
            {datePublished.substring(datePublished.indexOf(' ') + 1, datePublished.indexOf(' ') + 12)}
          </p>

          <div className="purchased-document-status">
            <Info className="info-icon" size={18} />
            <p>{purchasedDocumentStatus}</p>
          </div>

          <div className="comment-buttons">
            <ThumbsUp
              className={"like " + (isLiked ? "liked" : "")}
              onClick={(isLiked) ? removeLikeFromComment : likeComment}
              data-tip="This comment is helpful"
            />
            <p>{likes}</p>
          </div>
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default Comment;