# dOrg DAO
## Deploying The DAO
`npx daostack-migrate --params ./dao-params.json --output ./dao-deployment.json --gasPrice 15 --provider <YOUR_ETHERUM_NODE> --private-key <YOUR_PRIVATE_KEY>`

Please update the `dao-deployment.json`

## Using Scripts
Create a `.env` file at the root directly, and add `PRIVATE_KEY=0xMY_PRIVATE_KEY` in it.

## Changing Voting Machine Configurations
In order for voting machine configuration changes to take affect, you first need to:
1. Use `scripts/setVMParams` to set the parameters within the voting machine's contract.  
2. Use `scripts/setSchemeParams` to set the parameters within the scheme contracts.  
3. Make a proposal to the DAO's SchemeRegistrar scheme to edit the affected schemes.  

Please update the `dao-params-hash.json`
