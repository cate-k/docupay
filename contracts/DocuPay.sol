import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.7.0;
pragma experimental ABIEncoderV2;

contract DocuPay is Ownable {
  // Prevent integer overflow
  using SafeMath for uint256;

  // Circuit breaker to prevent user from transferring funds into the smart contract
  bool public paused = false;

  modifier setPause {
    require(!paused);
    _;
  }

  // Document structure
  struct Document {
    string title;
    address payable uploader;
    uint256 price;
    string description;
    string file;
  }

  string docupayHash;

  // Store documents in an array
  Document[] public documents;

  // Users have libraries of their own to store their files they uploaded
  mapping(address => uint256[]) public filesUploaded;

  // Map users to an array of documents they've published
  mapping(address => uint256[]) public documentsPublished;

  // Map users to an array of documents they've purchased
  mapping(address => uint256[]) public documentsPurchased;

  // Setters
  function setHash(string memory ipfsHash) public {
    docupayHash = ipfsHash;
  }

  // Getters
  function getHash() public view returns (string memory ipfsHash) {
    return docupayHash;
  }

  function getDocument(uint256 i) public view returns (Document memory) {
    return documents[i];
  }

  function getDocumentsPublishedTotal(address user) public view returns (uint256) {
    return documentsPublished[user].length;
  }

  function getDocumentsPublished(address user, uint256 i) public view returns (uint256) {
    return documentsPublished[user][i];
  }

  function getDocumentsPurchasedTotal(address user) public view returns (uint256) {
    return documentsPurchased[user].length;
  }

  function getDocumentsPurchased(address user, uint256 i) public view returns (uint256) {
    return documentsPurchased[user][i];
  }

  // Create/publish a document
  function publishDocument(
    string memory title,
    uint256 price,
    string memory description,
    string memory file
  ) public {
    // Prevent the uploader from creating a title and description that's too short or long
    require(bytes(title).length > 0 && bytes(title).length < 20, "Invalid title length");
    require(bytes(description).length > 0 && bytes(description).length < 10000, "Invalid description length");

    // Publish the document
    documents.push(Document(title, msg.sender, price, description, file));
    documentsPublished[msg.sender].push(documents.length);
  }

  // Determine whether a user has purchased the document already
  // If so, they will not need to buy it again
  function isDocumentPurchased(uint256 i) public view returns (bool) {
    for (uint256 j = 0; j < documentsPurchased[msg.sender].length; j++) {
      if (documentsPurchased[msg.sender][j] == i) return true;
    }
    return false;
  }

  // Publish and read/gain access to a document
  function purchaseDocument(uint256 i) setPause public payable {
    // Check if user has already bought this document
    require(msg.sender != documents[i].uploader && !isDocumentPurchased(i));

    // Check if user has enough ETH to purchase it
    require(msg.value == documents[i].price, "Invalid price");

    // Purchase the document
    documents[i].uploader.transfer(msg.value);

    // Add the newly purchased document to the user's library
    documentsPurchased[msg.sender].push(i);
  }

  // Restricting access was achieved using OpenZeppelin's "Ownable" contract
  // Only the account that deployed this contract can trigger and reset the circuit breaker
  function stopPause() public onlyOwner {
    paused = false;
  }
}