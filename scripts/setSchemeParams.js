// TODO: Go through each scheme, call setParams(vmHash, vmAddress)
const Utils = require("./utils");

async function setSchemeParams() {
  const schemes = await Utils.getSchemeContracts();

  // Testing
  const UControllerAddress = require("../dao-deployment.json")["mainnet"]["base"]["UController"];
  const AvatarAddress = require("../dao-deployment.json")["mainnet"]["dao"]["Avatar"];
  const UController = require("@daostack/arc/build/contracts/UController.json");
  const uController = await new Utils.web3.eth.Contract(UController.abi, UControllerAddress);

  for (let i = 0; i < schemes.length; ++i) {
    const result = await uController.methods.getSchemeParameters(
      schemes[i].schemeAddress, AvatarAddress
    );

    console.log(schemes[i].name);
    console.log(result);
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
