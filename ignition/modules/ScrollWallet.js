const { buildModule } = require("@nomicfoundation/ignition-core");

module.exports = buildModule("ScrollMultiSigWallet", (m) => {
    const scrollWallet = m.contract("ScrollMultiSigWallet", []);
    return { scrollWallet };
});
