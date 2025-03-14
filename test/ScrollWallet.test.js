const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScrollWallet", function () {
    let ScrollWallet, scrollWallet, owner, addr1, addr2;

    beforeEach(async function () {
        // Get contract factory
        ScrollWallet = await ethers.getContractFactory("ScrollWallet");

        // Get signers (accounts)
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy contract
        scrollWallet = await ScrollWallet.deploy();
        await scrollWallet.deployed();
    });

    it("Should deploy the contract and set the owner", async function () {
        expect(await scrollWallet.owner()).to.equal(owner.address);
    });

    it("Should accept deposits", async function () {
        const depositAmount = ethers.parseEther("1"); // 1 ETH

        // addr1 sends 1 ETH to the contract
        await addr1.sendTransaction({
            to: scrollWallet.target,
            value: depositAmount,
        });

        const contractBalance = await ethers.provider.getBalance(scrollWallet.target);
        expect(contractBalance).to.equal(depositAmount);
    });

    it("Should allow the owner to withdraw funds", async function () {
        const depositAmount = ethers.parseEther("1");

        // addr1 deposits 1 ETH
        await addr1.sendTransaction({
            to: scrollWallet.target,
            value: depositAmount,
        });

        // Get owner's balance before withdrawal
        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

        // Withdraw funds as owner
        await scrollWallet.withdraw();

        // Get owner's balance after withdrawal
        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

        expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });

    it("Should prevent non-owners from withdrawing", async function () {
        await expect(scrollWallet.connect(addr1).withdraw()).to.be.revertedWith("Not the owner");
    });
});
