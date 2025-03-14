// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScrollMultiSigWallet {
    struct Wallet {
        string name;
        address[] members;
        address treasurer;
        uint256 requiredSignatures;
        mapping(address => bool) isMember;
        mapping(bytes32 => mapping(address => bool)) approvals; // Tracks approvals per request
    }

    mapping(address => uint256) public personalWallets; // Individual user balances
    mapping(bytes32 => Wallet) public groupWallets; // Group wallets with multisig

    event WalletCreated(string name, address indexed creator);
    event FundsSent(address indexed from, address indexed to, uint256 amount);
    event WithdrawalRequested(bytes32 groupId, uint256 amount);
    event WithdrawalApproved(bytes32 groupId, address approver);
    event TreasurerElected(bytes32 groupId, address newTreasurer);

    modifier onlyGroupMember(bytes32 groupId) {
        require(groupWallets[groupId].isMember[msg.sender], "Not a group member");
        _;
    }

    modifier onlyTreasurer(bytes32 groupId) {
        require(msg.sender == groupWallets[groupId].treasurer, "Not the treasurer");
        _;
    }

    function createPersonalWallet() external {
        require(personalWallets[msg.sender] == 0, "Wallet already exists");
        personalWallets[msg.sender] = 0;
    }

    function createGroupWallet(string memory name, address[] memory members, uint256 requiredSignatures) external {
        require(members.length >= requiredSignatures, "Not enough members for multisig");
        bytes32 groupId = keccak256(abi.encodePacked(name, block.timestamp));

        Wallet storage newWallet = groupWallets[groupId];
        newWallet.name = name;
        newWallet.members = members;
        newWallet.requiredSignatures = requiredSignatures;
        newWallet.treasurer = members[0]; // Default first member as treasurer

        for (uint256 i = 0; i < members.length; i++) {
            newWallet.isMember[members[i]] = true;
        }

        emit WalletCreated(name, msg.sender);
    }

    function sendFunds(address recipient, uint256 amount) external {
        require(personalWallets[msg.sender] >= amount, "Insufficient funds");
        personalWallets[msg.sender] -= amount;
        personalWallets[recipient] += amount;

        emit FundsSent(msg.sender, recipient, amount);
    }

    function requestWithdrawal(bytes32 groupId, uint256 amount) external onlyTreasurer(groupId) {
        require(amount > 0, "Invalid amount");

        bytes32 requestId = keccak256(abi.encodePacked(groupId, amount, block.timestamp));
        emit WithdrawalRequested(requestId, amount);
    }

    function approveWithdrawal(bytes32 groupId, bytes32 requestId) external onlyGroupMember(groupId) {
        require(!groupWallets[groupId].approvals[requestId][msg.sender], "Already approved");

        groupWallets[groupId].approvals[requestId][msg.sender] = true;
        emit WithdrawalApproved(groupId, msg.sender);
    }

    function electTreasurer(bytes32 groupId, address newTreasurer) external onlyGroupMember(groupId) {
        groupWallets[groupId].treasurer = newTreasurer;
        emit TreasurerElected(groupId, newTreasurer);
    }

    receive() external payable {
        personalWallets[msg.sender] += msg.value;
    }
}
