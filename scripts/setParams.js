// Call GenesisProtocol.setParameters for each parameter set in the list.
const Utils = require("./utils");
const getParamsHashes = require("./getParamsHashes").default;
const getParams = require("./getParams").default;

// Returns true if the parameters are already set in the contract
function isSet(params) {
  const values = Object.values(params);
  for (let i = 0; i < values.length; ++i) {
    if (values[i] !== "0" && values[i] !== 0 &&
        values[i] !== "0x0000000000000000000000000000000000000000") {
      return true;
    }
  }
  return false;
}

async function setParams() {
  const paramArgs = Utils.getParamArgs();
  const paramHashes = await getParamsHashes(false);
  const params = await getParams(paramHashes, false);
  const genesisProtocol = await Utils.getGenesisProtocolContract();

  // post a transaction to add it
  for (let i = 0; i < paramArgs.length; ++i) {
    if (isSet(params[i])) {
      console.log("Parameters Already Set");
      console.log(`Index: ${i} Hash: ${paramHashes[i]}`);
      continue;
    }

    Utils.startTx(`call setParameters for params at index ${i}`);

    const tx = await Utils.sendTx(
      genesisProtocol.methods.setParameters(...paramArgs[i])
    );

    await Utils.logTx(tx, `setParameters Finished. Hash: ${paramHashes[i]}`);
  }
}

if (require.main === module) {
  setParams()
    .catch((error) => {
      Utils.logError(`Error: ${error.message}`);
    });
} else {
  module.exports.default = setParams;
}
