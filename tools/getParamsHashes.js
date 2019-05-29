// TODO: return params hash from given params

const Web3 = require("web3");
const Web3Node = "https://mainnet.infura.io/";
const GenesisProtocol = require("@daostack/infra/build/contracts/GenesisProtocol.json");
const GenesisProtocolAddress = require("@daostack/migration/migration.json")["mainnet"]["base"]["GenesisProtocol"];
const DAOParams = require("../dao-params.json");

async function getParamsHash(consoleOut = true) {
  const web3 = new Web3(Web3Node);
  const block = await web3.eth.getBlock("latest");
  const opts = {
    gas: block.gasLimit - 100000,
    gasPrice: undefined
  };
  const genesisProtocol = await new web3.eth.Contract(GenesisProtocol.abi, GenesisProtocolAddress, opts);

  const vmsParams = DAOParams["VotingMachinesParams"];
  let paramHashes = [];

  for (let i = 0; i < vmsParams.length; ++i) {
    const vmParams = vmsParams[i];
    const params = [
      vmParams["queuedVoteRequiredPercentage"],
      vmParams["queuedVotePeriodLimit"],
      vmParams["boostedVotePeriodLimit"],
      vmParams["preBoostedVotePeriodLimit"],
      vmParams["thresholdConst"],
      vmParams["quietEndingPeriod"],
      vmParams["proposingRepReward"] ? vmParams["proposingRepReward"] : vmParams["proposingRepRewardGwei"],
      vmParams["votersReputationLossRatio"],
      vmParams["minimumDaoBounty"] ? vmParams["minimumDaoBounty"] : vmParams["minimumDaoBountyGWei"],
      vmParams["daoBountyConst"],
      vmParams["activationTime"]
    ];
    const voteOnBehalf = vmParams["voteOnBehalf"]
    const hash = await genesisProtocol.methods.getParametersHash(params, voteOnBehalf).call();
    paramHashes.push(hash);
  }

  if (consoleOut) {
    console.log(`Param Hashes:`);
    paramHashes.map((hash, index) => console.log(`${index}. ${hash}`));
  }

  return paramHashes;
}

if (require.main === module) {
  getParamsHash()
    .catch((error) => {
      console.log(`Error: ${error.message}`);
    });
} else {
  module.exports.default = getParamsHash;
}
