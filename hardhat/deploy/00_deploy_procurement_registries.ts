import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployProcurementRegistries: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const userRegistry = await deploy("UserRegistry", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  const tenderRegistry = await deploy("TenderRegistry", {
    from: deployer,
    args: [userRegistry.address, deployer],
    log: true,
    autoMine: true,
  });

  const bidRegistry = await deploy("BidRegistry", {
    from: deployer,
    args: [userRegistry.address, tenderRegistry.address, deployer],
    log: true,
    autoMine: true,
  });

  const awardRegistry = await deploy("AwardRegistry", {
    from: deployer,
    args: [userRegistry.address, tenderRegistry.address, bidRegistry.address, deployer],
    log: true,
    autoMine: true,
  });

  const tender = await hre.ethers.getContractAt("TenderRegistry", tenderRegistry.address);
  if ((await tender.awardRegistry()) !== awardRegistry.address) {
    const tx = await tender.setAwardRegistry(awardRegistry.address);
    await tx.wait();
    console.log("Linked AwardRegistry in TenderRegistry:", awardRegistry.address);
  }
};

export default deployProcurementRegistries;

deployProcurementRegistries.tags = ["ProcurementRegistries"];
