// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SosaToken is ERC20 {
    address public owner;

    constructor(uint256 initialSupply) ERC20("Sosa Token", "SOSA") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        owner = msg.sender;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy SOSA");
        uint256 amountToBuy = msg.value * 1000; // 1 ETH = 1000 SOSA
        _mint(msg.sender, amountToBuy);
    }
}
