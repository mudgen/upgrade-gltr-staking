// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

function getSelectors (contract) {    
  const selectors = []
  for(const fragment of contract.interface.fragments) {
    if(hre.ethers.Fragment.isFunction(fragment)) {
      selectors.push(fragment.selector)      
    }    
  }  
  return selectors
}

const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }

async function deployUpgrade() {
  const ownerAddress = "0x01F010a5e001fe9d6940758EA5e8c777885E351e"
  const signer = await hre.ethers.getImpersonatedSigner(ownerAddress)  
  const stakingDiamondAddress = "0x1fE64677Ab1397e20A1211AFae2758570fEa1B8c" 
  const diamondCutFacet = await hre.ethers.getContractAt("DiamondCutFacet", stakingDiamondAddress, signer)

  

  // deploy facets
  console.log('')
  console.log('Deploying facets')
  const FacetNames = [
    'StakingFacet',
    'StakingTokenFacet'
  ]
  const cut = []
  for (const facetName of FacetNames) {
    const facet = await hre.ethers.deployContract(facetName)
    await facet.waitForDeployment();    
    console.log(`${facetName} deployed: ${await facet.getAddress()}`)
    cut.push({
      facetAddress: await facet.getAddress(),
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    })
  }
  //console.log(cut)
  
  const tx = await diamondCutFacet.diamondCut(cut, hre.ethers.ZeroAddress, '0x', { gasLimit: 5000000})
  let receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log("Diamond upgrade complete")
  return { stakingDiamondAddress }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.deployUpgrade === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

exports.deployUpgrade = deployUpgrade