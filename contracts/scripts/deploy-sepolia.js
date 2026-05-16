import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting deployment of BGPSProcurement to Sepolia...");

  // Hardhat v2 uses different methods for signer balance and wait
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // 1. Deploy Contract
  const BGPSProcurement = await hre.ethers.getContractFactory("BGPSProcurement");
  const contract = await BGPSProcurement.deploy();

  await contract.deployed();
  const contractAddress = contract.address;

  console.log("BGPSProcurement deployed to:", contractAddress);

  // 2. Authorize Initial Admin (if provided in env)
  const initialAdmin = process.env.BGPS_ADMIN_WALLET;
  if (initialAdmin && hre.ethers.utils.isAddress(initialAdmin)) {
    console.log(`Authorizing initial Admin Operator: ${initialAdmin}`);
    const tx = await contract.addAdminOperator(initialAdmin);
    await tx.wait();
    console.log("Admin Operator authorized successfully.");
  }

  // 3. Save Deployment Artifact
  const deploymentData = {
    network: "sepolia",
    chainId: 11155111,
    contractAddress: contractAddress,
    deployer: deployer.address,
    adminOperator: initialAdmin || "none",
    deployedAt: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "sepolia.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("Deployment artifact saved to deployments/sepolia.json");
  console.log("\nNext steps:");
  console.log(`1. Update NEXT_PUBLIC_BGPS_CONTRACT_ADDRESS in .env.local with ${contractAddress}`);
  console.log("2. Run the verification script: npx hardhat run scripts/verify-etherscan.js --network sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
