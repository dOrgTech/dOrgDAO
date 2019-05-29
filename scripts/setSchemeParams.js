// Set the scheme params (with the voting machine's params hash and other information)
const Utils = require("./utils");
const getVMParamsHashes = require("./getVMParamsHashes").default;

async function setSchemeParams() {
  const vmParamsHashes = await getVMParamsHashes(false);
  const schemeNames = [
    "ContributionReward",
    "GenericScheme",
    "SchemeRegistrar",
    "GlobalConstraintRegistrar",
    "UpgradeScheme"
  ];

  // For each scheme
  for (let i = 0; i < schemeNames.length; ++i) {
    const name = schemeNames[i];

    // Get the params for the scheme
    const schemeParams = Utils.DAOParams[name];
    if (schemeParams === undefined) {
      continue;
    }

    // Get the voting machine params for the scheme
    let vmParamsIndex = schemeParams["voteParams"];
    if (vmParamsIndex === undefined) {
      vmParamsIndex = 0;
    }

    // Get the params hash for the voting machine this scheme is using
    const vmParamsHash = vmParamsHashes[vmParamsIndex];

    // Create wrapper for scheme contract
    const abi = require(`@daostack/arc/build/contracts/${name}.json`);
    const address = require("../dao-deployment.json")["mainnet"]["base"][name];
    const contract = await new Utils.web3.eth.Contract(abi.abi, address);
    let args = [vmParamsHash, Utils.GenesisProtocolAddress];

    if (name === "GenericScheme") {
      args.push(schemeParams["targetContract"]);
    } else if (name === "SchemeRegistrar") {
      args = [vmParamsHash, ...args];
    }

    const hash = await contract.methods.getParametersHash(...args).call();

    Utils.startTx(`Calling setParameters on ${name}\nArguments: [${args}]\nHash: ${hash}`);

    const tx = await Utils.sendTx(
      contract.methods.setParameters(...args)
    );

    await Utils.logTx(tx, `setParameters Finished. Hash: ${hash}`);
  }
}

if (require.main === module) {
  setSchemeParams()
    .catch((error) => {
      Utils.logError(`Error: ${error.message}`);
    });
} else {
  module.exports.default = setSchemeParams;
}
