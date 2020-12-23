## Design Pattern Decisions
#### Circuit Breaker
Circuit breakers are an emergency stop design pattern that quits the smart contract's functionality to reduce damage. They are used when high-risk bugs are found and a fix cannot be quickly implemented. [(1)](https://consensys.github.io/smart-contract-best-practices/software_engineering/#circuit-breakers-pause-contract-functionality)

They can either be programmed to trigger once a set of conditions are met, or be triggered manually by a trusted account/party. I have implemented the latter option in my smart contract.

##

#### Restricting Access
As I wanted my circuit breaker to be manually triggered, I chose to use this design pattern.

OpenZeppelin has a contract named `Ownable` which I used to implement the pattern. The owner of an `Ownable` contract is the account that deployed it by default, so this was perfect as I intended to be the only administrative user. [(2)](https://docs.openzeppelin.com/contracts/3.x/access-control)

I decided against choosing other design patterns as I didn't want to overcomplicate the code and kept it simple instead.

##

#### References
[(1) Circuit Breakers - Ethereum Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/software_engineering/#circuit-breakers-pause-contract-functionality)

[(2) Access Control - OpenZeppelin Docs](https://docs.openzeppelin.com/contracts/3.x/access-control)
