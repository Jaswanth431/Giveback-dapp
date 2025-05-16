const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying CrowdFunding contract...");

  // Get the contract factory
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");

  // Deploy the contract
  const crowdFunding = await CrowdFunding.deploy();
  await crowdFunding.deployed();

  console.log("CrowdFunding deployed to:", crowdFunding.address);

  // Create artifacts directory if it doesn't exist
  const artifactsDir = path.join(__dirname, "../artifacts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  // Save contract address
  const addressFile = path.join(artifactsDir, "contract-address.json");
  fs.writeFileSync(
    addressFile,
    JSON.stringify({ address: crowdFunding.address }, null, 2)
  );
  console.log("Contract address saved to:", addressFile);

  // Get and save ABI
  const abiFile = path.join(artifactsDir, "contract-abi.json");
  fs.writeFileSync(
    abiFile,
    JSON.stringify(CrowdFunding.interface.format("json"), null, 2)
  );
  console.log("Contract ABI saved to:", abiFile);

  // Get and save bytecode
  const bytecodeFile = path.join(artifactsDir, "contract-bytecode.json");
  fs.writeFileSync(
    bytecodeFile,
    JSON.stringify({ bytecode: CrowdFunding.bytecode }, null, 2)
  );
  console.log("Contract bytecode saved to:", bytecodeFile);

  // Create a complete contract info file
  const contractInfo = {
    address: crowdFunding.address,
    abi: CrowdFunding.interface.format("json"),
    bytecode: CrowdFunding.bytecode,
    deployedAt: new Date().toISOString(),
    network: "hedera"
  };

  const contractInfoFile = path.join(artifactsDir, "contract-info.json");
  fs.writeFileSync(
    contractInfoFile,
    JSON.stringify(contractInfo, null, 2)
  );
  console.log("Complete contract info saved to:", contractInfoFile);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 