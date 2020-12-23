var DocuPay = artifacts.require("../contracts/DocuPay.sol");

module.exports = function(deployer) {
  deployer.deploy(DocuPay);
};
