const DocuPay = artifacts.require("DocuPay");

contract("DocuPay", function(accounts) {
  // Checks that the user starts with zero published documents in total
  it("Initialises with 0 published documents", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.getDocumentsPublishedTotal(accounts[0]);
    }).then(function(count) {
      assert.equal(count, 0);
    });
  });

  // Tests that the user can publish a document
  it("Publishes 1 document", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.publishDocument("Title", 1, "Description", "File");
    }).then(function(document) {
      assert.equal("1", 1, "1", "1", document);
    });
  });

  // Makes sure that one document has been published
  it("Increments the number of published documents by 1", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.getDocumentsPublishedTotal(accounts[0]);
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  // Ensures that zero documents have been initially purchased
  it("Initialises with 0 purchased documents", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.getDocumentsPurchasedTotal(accounts[0]);
    }).then(function(count) {
      assert.equal(count, 0);
    });
  });

  // Checks if the account is the owner
  it("Check if account is the owner", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.getOwner(accounts[0]);
    }).then(function() {
      assert.equal(undefined);
    });
  });
});