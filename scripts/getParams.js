// Returns the Parameters struct that's associated with the given params hash
const Utils = require("./utils");
const getParamsHashes = require("./getParamsHashes").default;

async function getParams(paramHashes = undefined, consoleOut = true) {
  if (paramHashes === undefined) {
    paramHashes = await getParamsHashes(false);
  }

  const genesisProtocol = await Utils.getGenesisProtocolContract();
  const params = [];

  for (let i = 0; i < paramHashes.length; ++i) {
    params.push(
      await genesisProtocol.methods.parameters(
        paramHashes[i]
      ).call()
    );
  }

  if (consoleOut) {
    console.log("Params:");
    params.map((Parameters, index) => console.log(
      `[${index}]\n${JSON.stringify(Parameters, undefined, 2)}`
    ));
  }

  return params;
}

if (require.main === module) {
  getParams()
    .catch((error) => {
      Utils.logError(`Error: ${error.message}`);
    });
} else {
  module.exports.default = getParams;
}
