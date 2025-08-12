async function main() {
  // Deploy SosaToken
  const SosaToken = await ethers.getContractFactory("SosaToken");
  const sosa = await SosaToken.deploy(1000000);
  console.log("SosaToken deployed to:", await sosa.getAddress());

  // Deploy TestToken
  const TestToken = await ethers.getContractFactory("TestToken");
  const test = await TestToken.deploy(500000);
  console.log("TestToken deployed to:", await test.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
