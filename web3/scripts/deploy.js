const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RewardToken
  console.log("Deploying RewardToken...");
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy("InnoFund Token");
  await rewardToken.waitForDeployment();
  console.log("RewardToken deployed to:", await rewardToken.getAddress());

  // Deploy FundingContract
  console.log("Deploying FundingContract...");
  const FundingContract = await hre.ethers.getContractFactory("FundingContract");
  const fundingContract = await FundingContract.deploy(await rewardToken.getAddress());
  await fundingContract.waitForDeployment();
  console.log("FundingContract deployed to:", await fundingContract.getAddress());

  // Deploy ProjectDAO
  console.log("Deploying ProjectDAO...");
  const ProjectDAO = await hre.ethers.getContractFactory("ProjectDAO");
  const projectDAO = await ProjectDAO.deploy(
    await fundingContract.getAddress(),
    await rewardToken.getAddress()
  );
  await projectDAO.waitForDeployment();
  console.log("ProjectDAO deployed to:", await projectDAO.getAddress());

  // Set up permissions
  console.log("Setting up permissions...");
  await rewardToken.transferOwnership(await fundingContract.getAddress());
  console.log("Transferred RewardToken ownership to FundingContract");

  // Verify contracts on Snowtrace
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    
    console.log("Verifying contracts on Snowtrace...");
    try {
      await hre.run("verify:verify", {
        address: await rewardToken.getAddress(),
        constructorArguments: ["InnoFund Token"],
      });
    } catch (error) {
      console.log("Error verifying RewardToken:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: await fundingContract.getAddress(),
        constructorArguments: [await rewardToken.getAddress()],
      });
    } catch (error) {
      console.log("Error verifying FundingContract:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: await projectDAO.getAddress(),
        constructorArguments: [
          await fundingContract.getAddress(),
          await rewardToken.getAddress(),
        ],
      });
    } catch (error) {
      console.log("Error verifying ProjectDAO:", error.message);
    }
  }

  // Save contract addresses
  const fs = require("fs");
  const contractAddresses = {
    rewardToken: await rewardToken.getAddress(),
    fundingContract: await fundingContract.getAddress(),
    projectDAO: await projectDAO.getAddress(),
  };

  fs.writeFileSync(
    "contract-addresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("Contract addresses saved to contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
