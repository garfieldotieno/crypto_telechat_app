// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ScrollMultiSigWallet
 * @dev A wallet system for both personal and group multi-signature wallets on Scroll network
 */
contract ScrollMultiSigWallet {
    // Data structures
    struct PersonalWallet {
        uint256 id;
        address owner;
        uint256 balance;
        bool active;
    }

    struct GroupWallet {
        uint256 id;
        string name;
        address[] members;
        address treasurer;
        uint256 requiredSignatures;
        uint256 balance;
        bool active;
        mapping(address => bool) isMember;
        mapping(bytes32 => WithdrawalRequest) withdrawalRequests;
    }

    struct WithdrawalRequest {
        bytes32 requestId;
        uint256 amount;
        address requestor;
        uint256 signatureCount;
        bool executed;
        mapping(address => bool) signatures;
    }

    // State variables
    mapping(uint256 => PersonalWallet) public personalWallets;
    mapping(uint256 => GroupWallet) public groupWallets;
    mapping(address => uint256[]) public userPersonalWallets;
    mapping(address => uint256[]) public userGroupWallets;
    
    uint256 private personalWalletCounter;
    uint256 private groupWalletCounter;

    // Events matching backend.py functionality
    event PersonalWalletCreated(uint256 indexed walletId, address indexed owner);
    event GroupWalletCreated(uint256 indexed walletId, string name, address indexed creator);
    event MemberAddedToGroup(uint256 indexed groupId, address indexed member);
    event FundsLoaded(uint256 indexed walletId, string walletType, uint256 amount);
    event FundsSent(uint256 indexed fromWalletId, uint256 indexed toWalletId, string toType, uint256 amount);
    event WithdrawalRequested(uint256 indexed groupId, bytes32 indexed requestId, uint256 amount);
    event WithdrawalSigned(uint256 indexed groupId, bytes32 indexed requestId, address signer);
    event WithdrawalExecuted(uint256 indexed walletId, string walletType, uint256 amount);

    // Modifiers
    modifier onlyPersonalWalletOwner(uint256 walletId) {
        require(personalWallets[walletId].owner == msg.sender, "Not the wallet owner");
        _;
    }

    modifier onlyGroupMember(uint256 groupId) {
        require(groupWallets[groupId].isMember[msg.sender], "Not a group member");
        _;
    }

    modifier onlyTreasurer(uint256 groupId) {
        require(msg.sender == groupWallets[groupId].treasurer, "Not the treasurer");
        _;
    }

    /**
     * @dev Creates a personal wallet for the sender
     * @return walletId The ID of the newly created wallet
     */
    function createPersonalWallet() external returns (uint256) {
        personalWalletCounter++;
        uint256 walletId = personalWalletCounter;
        
        PersonalWallet storage wallet = personalWallets[walletId];
        wallet.id = walletId;
        wallet.owner = msg.sender;
        wallet.balance = 0;
        wallet.active = true;
        
        userPersonalWallets[msg.sender].push(walletId);
        
        emit PersonalWalletCreated(walletId, msg.sender);
        return walletId;
    }

    /**
     * @dev Creates a group wallet
     * @param name The name of the group wallet
     * @param members Array of member addresses
     * @param requiredSignatures Number of signatures required for withdrawals
     * @return walletId The ID of the newly created group wallet
     */
    function createGroupWallet(
        string memory name,
        address[] memory members,
        uint256 requiredSignatures
    ) external returns (uint256) {
        require(members.length > 0, "Group must have at least one member");
        require(requiredSignatures > 0 && requiredSignatures <= members.length, "Invalid signature requirement");
        
        groupWalletCounter++;
        uint256 walletId = groupWalletCounter;
        
        GroupWallet storage wallet = groupWallets[walletId];
        wallet.id = walletId;
        wallet.name = name;
        wallet.treasurer = msg.sender; // Creator is the initial treasurer
        wallet.requiredSignatures = requiredSignatures;
        wallet.balance = 0;
        wallet.active = true;
        
        // Add all members including the creator
        bool creatorIncluded = false;
        for (uint i = 0; i < members.length; i++) {
            wallet.members.push(members[i]);
            wallet.isMember[members[i]] = true;
            userGroupWallets[members[i]].push(walletId);
            
            if (members[i] == msg.sender) {
                creatorIncluded = true;
            }
        }
        
        // Make sure creator is included as a member
        if (!creatorIncluded) {
            wallet.members.push(msg.sender);
            wallet.isMember[msg.sender] = true;
            userGroupWallets[msg.sender].push(walletId);
        }
        
        emit GroupWalletCreated(walletId, name, msg.sender);
        return walletId;
    }
    
    /**
     * @dev Adds a member to a group wallet
     * @param groupId The ID of the group wallet
     * @param member Address of the new member
     */
    function addGroupMember(uint256 groupId, address member) external onlyTreasurer(groupId) {
        require(!groupWallets[groupId].isMember[member], "Address is already a member");
        
        groupWallets[groupId].members.push(member);
        groupWallets[groupId].isMember[member] = true;
        userGroupWallets[member].push(groupId);
        
        emit MemberAddedToGroup(groupId, member);
    }
    
    /**
     * @dev Loads funds into a personal wallet
     * @param walletId The ID of the personal wallet
     */
    function loadPersonalWallet(uint256 walletId) external payable onlyPersonalWalletOwner(walletId) {
        require(msg.value > 0, "Amount must be greater than zero");
        
        personalWallets[walletId].balance += msg.value;
        
        emit FundsLoaded(walletId, "personal", msg.value);
    }
    
    /**
     * @dev Loads funds into a group wallet
     * @param groupId The ID of the group wallet
     */
    function loadGroupWallet(uint256 groupId) external payable onlyGroupMember(groupId) {
        require(msg.value > 0, "Amount must be greater than zero");
        
        groupWallets[groupId].balance += msg.value;
        
        emit FundsLoaded(groupId, "group", msg.value);
    }
    
    /**
     * @dev Sends funds from one personal wallet to another personal wallet
     * @param fromWalletId Source personal wallet ID
     * @param toWalletId Destination personal wallet ID
     * @param amount Amount to send
     */
    function sendToPersonal(uint256 fromWalletId, uint256 toWalletId, uint256 amount) 
        external 
        onlyPersonalWalletOwner(fromWalletId) 
    {
        require(personalWallets[toWalletId].active, "Destination wallet does not exist");
        require(personalWallets[fromWalletId].balance >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than zero");
        
        personalWallets[fromWalletId].balance -= amount;
        personalWallets[toWalletId].balance += amount;
        
        emit FundsSent(fromWalletId, toWalletId, "personal", amount);
    }
    
    /**
     * @dev Sends funds from a personal wallet to a group wallet
     * @param fromWalletId Source personal wallet ID
     * @param toGroupId Destination group wallet ID
     * @param amount Amount to send
     */
    function sendToGroup(uint256 fromWalletId, uint256 toGroupId, uint256 amount) 
        external 
        onlyPersonalWalletOwner(fromWalletId) 
    {
        require(groupWallets[toGroupId].active, "Destination group does not exist");
        require(personalWallets[fromWalletId].balance >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than zero");
        
        personalWallets[fromWalletId].balance -= amount;
        groupWallets[toGroupId].balance += amount;
        
        emit FundsSent(fromWalletId, toGroupId, "group", amount);
    }
    
    /**
     * @dev Withdraws funds from a personal wallet
     * @param walletId Personal wallet ID
     * @param amount Amount to withdraw
     */
    function withdrawPersonal(uint256 walletId, uint256 amount) 
        external 
        onlyPersonalWalletOwner(walletId) 
    {
        require(personalWallets[walletId].balance >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than zero");
        
        personalWallets[walletId].balance -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalExecuted(walletId, "personal", amount);
    }
    
    /**
     * @dev Requests a withdrawal from a group wallet
     * @param groupId Group wallet ID
     * @param amount Amount to withdraw
     * @return requestId The ID of the withdrawal request
     */
    function requestGroupWithdrawal(uint256 groupId, uint256 amount) 
        external 
        onlyTreasurer(groupId) 
        returns (bytes32) 
    {
        require(groupWallets[groupId].balance >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than zero");
        
        bytes32 requestId = keccak256(abi.encodePacked(groupId, amount, block.timestamp, msg.sender));
        WithdrawalRequest storage request = groupWallets[groupId].withdrawalRequests[requestId];
        
        request.requestId = requestId;
        request.amount = amount;
        request.requestor = msg.sender;
        request.executed = false;
        
        // Treasurer is the first signer
        request.signatures[msg.sender] = true;
        request.signatureCount = 1;
        
        emit WithdrawalRequested(groupId, requestId, amount);
        return requestId;
    }
    
    /**
     * @dev Signs a group withdrawal request
     * @param groupId Group wallet ID
     * @param requestId Withdrawal request ID
     */
    function signGroupWithdrawal(uint256 groupId, bytes32 requestId) 
        external 
        onlyGroupMember(groupId) 
    {
        WithdrawalRequest storage request = groupWallets[groupId].withdrawalRequests[requestId];
        
        require(request.requestId == requestId, "Request does not exist");
        require(!request.executed, "Request already executed");
        require(!request.signatures[msg.sender], "Already signed");
        
        request.signatures[msg.sender] = true;
        request.signatureCount += 1;
        
        emit WithdrawalSigned(groupId, requestId, msg.sender);
        
        // Auto-execute if enough signatures
        if (request.signatureCount >= groupWallets[groupId].requiredSignatures) {
            executeGroupWithdrawal(groupId, requestId);
        }
    }
    
    /**
     * @dev Executes a group withdrawal if enough signatures are collected
     * @param groupId Group wallet ID
     * @param requestId Withdrawal request ID
     */
    function executeGroupWithdrawal(uint256 groupId, bytes32 requestId) 
        internal 
    {
        WithdrawalRequest storage request = groupWallets[groupId].withdrawalRequests[requestId];
        
        require(!request.executed, "Request already executed");
        require(request.signatureCount >= groupWallets[groupId].requiredSignatures, "Not enough signatures");
        require(groupWallets[groupId].balance >= request.amount, "Insufficient balance");
        
        request.executed = true;
        groupWallets[groupId].balance -= request.amount;
        
        (bool success, ) = request.requestor.call{value: request.amount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalExecuted(groupId, "group", request.amount);
    }
    
    /**
     * @dev Gets the list of personal wallets owned by an address
     * @param owner The wallet owner address
     * @return walletIds Array of wallet IDs
     */
    function getPersonalWallets(address owner) external view returns (uint256[] memory) {
        return userPersonalWallets[owner];
    }
    
    /**
     * @dev Gets the list of group wallets a user is a member of
     * @param member The member address
     * @return walletIds Array of wallet IDs
     */
    function getGroupWallets(address member) external view returns (uint256[] memory) {
        return userGroupWallets[member];
    }
    
    /**
     * @dev Gets the balance of a personal wallet
     * @param walletId Personal wallet ID
     * @return balance The wallet balance
     */
    function getPersonalWalletBalance(uint256 walletId) external view returns (uint256) {
        return personalWallets[walletId].balance;
    }
    
    /**
     * @dev Gets the balance of a group wallet
     * @param groupId Group wallet ID
     * @return balance The wallet balance
     */
    function getGroupWalletBalance(uint256 groupId) external view returns (uint256) {
        return groupWallets[groupId].balance;
    }
    
    /**
     * @dev Gets the members of a group wallet
     * @param groupId Group wallet ID
     * @return members Array of member addresses
     */
    function getGroupMembers(uint256 groupId) external view returns (address[] memory) {
        return groupWallets[groupId].members;
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Any ETH sent directly to contract is rejected
        revert("Direct transfers not allowed. Use loadPersonalWallet or loadGroupWallet functions");
    }
}
