const DocuPay = artifacts.require("DocuPay");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(DocuPay, { from: accounts[0] });
};