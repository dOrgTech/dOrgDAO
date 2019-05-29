require("dotenv").config();
const Web3 = require("web3");
const Web3Node = "https://mainnet.infura.io/";
const web3 = new Web3(Web3Node);
const GenesisProtocol = require("@daostack/infra/build/contracts/GenesisProtocol.json");
const GenesisProtocolAddress = require("../dao-deployment.json")["mainnet"]["base"]["GenesisProtocol"];
const DAOParams = require("../dao-params.json");
const spinner = require("ora")();

// setup default account using the PRIVATE_KEY env var
const account = web3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

function startTx(message) {
  spinner.start(message);
}

async function sendTx(transaction) {
  const from = web3.eth.defaultAccount;
  return await transaction.send({
    from,
    gas: await transaction.estimateGas({ from }) * 2
  });
}

async function logTx(tx, message) {
  const { transactionHash, gasUsed } = tx;
  const { gasPrice } = await web3.eth.getTransaction(transactionHash);
  const txCost = web3.utils.fromWei((gasUsed * gasPrice).toString(), 'ether');
  spinner.info(`${transactionHash} | ${Number(txCost).toFixed(5)} ETH | ${message}`);
}

function logError(message) {
  spinner.fail(message);
}

async function getGenesisProtocolContract() {
  return await new web3.eth.Contract(
    GenesisProtocol.abi, GenesisProtocolAddress
  );
}

function getVMParamArgs() {
  const paramNameToIndex = {
    "queuedVoteRequiredPercentage": 0,
    "queuedVotePeriodLimit": 1,
    "boostedVotePeriodLimit": 2,
    "preBoostedVotePeriodLimit": 3,
    "thresholdConst": 4,
    "quietEndingPeriod": 5,
    "proposingRepReward": 6,
    "proposingRepRewardGwei": 6,
    "votersReputationLossRatio": 7,
    "minimumDaoBounty": 8,
    "minimumDaoBountyGWei": 8,
    "daoBountyConst": 9,
    "activationTime": 10
  };
  const vmsParams = DAOParams["VotingMachinesParams"];
  const paramArgs = [];

  for (let i = 0; i < vmsParams.length; ++i) {
    const vmParams = vmsParams[i];
    const voteOnBehalf = vmParams["voteOnBehalf"];

    if (voteOnBehalf === undefined) {
      throw Error("Error: 'voteOnBehalf' parameter not specified.");
    }

    const params = new Array(11).fill(undefined);
    const keys = Object.keys(paramNameToIndex);
    for (let j = 0; j < keys.length; ++j) {
      const paramName = keys[j];
      const paramValue = vmParams[paramName];

      if (paramValue !== undefined) {
        params[paramNameToIndex[paramName]] = paramValue;
      }
    }

    const undefinedIndex = params.indexOf(undefined);
    if (undefinedIndex > -1) {
      throw Error(`Error: Missing parameter at index ${undefinedIndex}.`);
    }

    paramArgs.push([ params, voteOnBehalf ]);
  }

  return paramArgs;
}

module.exports = {
  GenesisProtocolAddress,
  DAOParams,
  getGenesisProtocolContract,
  getVMParamArgs,
  startTx,
  sendTx,
  logTx,
  logError,
  web3
};
