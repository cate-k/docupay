import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.7.0;

contract DocuPay is Ownable {
  // Prevent integer overflow
  using SafeMath for uint256;

  // Circuit breaker to prevent user from transferring funds into the smart contract
  bool public paused = false;

  modifier setPause {
    require(!paused);
    _;
  }

  string docupayHash;

  // Setters
  function setHash(string memory ipfsHash) public {
    docupayHash = ipfsHash;
  }

  // Getters
  function getHash() public view returns (string memory ipfsHash) {
    return docupayHash;
  }

  // Restricting access was achieved using OpenZeppelin's "Ownable" contract
  // Only the account that deployed this contract can trigger and reset the circuit breaker
  function stopPause() public onlyOwner {
    paused = false;
  }
}