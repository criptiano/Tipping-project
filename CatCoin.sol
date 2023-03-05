// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CatCoin {

    mapping(address => uint256) public balances;

    event Sent(address from, address to, uint256 amount);

    constructor() {
        balances[msg.sender] = 100;
    }

    function send(address receiver, uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
