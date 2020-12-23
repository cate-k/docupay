## Avoiding Common Attacks
#### Integer Overflow & Underflow (SWC-101)
Integer overflow or underflow happens when an arithmetic value reaches its maximum or minimum size.

The arithmetic operation tries to create a number outside of the range, which can be either higher than the maximum or lower than the minimum value. [(1)](https://swcregistry.io/docs/SWC-101)

If a number reaches the maximum value, it will cause an overflow and come back to zero. Similarly for underflows, if a uint hits a value under zero it will be set to its maximum value. [(2)](https://consensys.github.io/smart-contract-best-practices/known_attacks/#integer-overflow-and-underflow)

To prevent this, I have used the SafeMath library provided by OpenZeppelin for all `uint256` variables.

##

#### Denial of Service by Block Gas Limit or startGas (SWC-128)
This occurs when the cost of executing a function exceeds the block gas limit. [(3)](https://swcregistry.io/docs/SWC-128)

The total of all transactions in a single block cannot surpass the block gas limit specified by the Ethereum network, or else it will fail.

If the transaction needs more gas to complete than the limit specifies, the transaction will not run successfully. Even though the transaction may fail, it always reaches the limit before finishing.

This denial of service condition is usually caused by code that loop over arrays that keep receiving data over time.

To mitigate this, I've avoided using `for` loops to iterate over any large arrays.

##

#### References
[(1) SWC-101 - SWC Registery](https://swcregistry.io/docs/SWC-101)

[(2) Integer Overflow & Underflow - Ethereum Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/known_attacks/#integer-overflow-and-underflow)

[(3) SWC-128 - SWC Registery](https://swcregistry.io/docs/SWC-128)
