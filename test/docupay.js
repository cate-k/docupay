const DocuPay = artifacts.require("DocuPay");

contract("DocuPay", function(accounts) {
  // What it does
  // Why I made it
  it("Should return the total of published documents", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.getDocumentsPublishedTotal.call();
    }).then(function(documentsPublished) {
      assert.equal(documentsPublished, "0", "The total was not zero");
    });
  });

  // What it does
  // Why I made it
  it("Should return the total of purchased documents", function() {
    return DocuPay.deployed().then(function(instance) {
      return instance.getDocumentsPurchasedTotal.call();
    }).then(function(documentsPurchased) {
      assert.equal(documentsPurchased, "0", "The total was not zero");
    });
  });
});