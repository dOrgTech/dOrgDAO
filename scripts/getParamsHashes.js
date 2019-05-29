// Returns the parameter hashes associated with the
// "VotingMachineParams" array in the dao-params.json config
const Utils = require("./utils");

async function getParamsHashes(consoleOut = true) {
  const paramArgs = Utils.getParamArgs();
  const genesisProtocol = await Utils.getGenesisProtocolContract();
  const paramHashes = [];

  for (let i = 0; i < paramArgs.length; ++i) {
    paramHashes.push(
      await genesisProtocol.methods.getParametersHash(...paramArgs[i]).call()
    );
  }

  if (consoleOut) {
    console.log("Param Hashes:");
    paramHashes.map((hash, index) => console.log(`${index}. ${hash}`));
  }

  return paramHashes;
}

if (require.main === module) {
  getParamsHashes()
    .catch((error) => {
      Utils.logError(`Error: ${error.message}`);
    });
} else {
  module.exports.default = getParamsHashes;
}
