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

  // Map the uploaded files
  mapping (address => string) public files;

  // Set the uploaded file
  function setFile(string calldata _file) setPause external {
    files[msg.sender] = _file;
  }

  // Restricting access was achieved using OpenZeppelin's "Ownable" contract
  // Only the account that deployed this contract can trigger and reset the circuit breaker
  function stopPause() public onlyOwner {
    paused = false;
  }
}