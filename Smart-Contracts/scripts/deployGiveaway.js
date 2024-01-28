const hre = require("hardhat");

async function main() {
  const ownerAddress = "0x72De66bFDEf75AE89aD98a52A1524D3C5dB5fB24";
  const airnodeAddress = "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D";

  const giveaway = await hre.ethers.deployContract("Giveaway", [airnodeAddress, ownerAddress]);

  await giveaway.waitForDeployment();

  console.log(
    `deployed to ${giveaway.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
