const hre = require("hardhat");
const {ethers, upgrades, waffle} = require("hardhat");


DCR_ADDRESS=null
TOKEN_ADDRESS="0x0711ed8b4d1eb1a935cdcc376a205c7dca584457"
async function main() {
    const [deployer] = await ethers.getSigners();
    let tokenAddress = TOKEN_ADDRESS
    await deployFaucet(tokenAddress);
}

async function deployFaucet(tokenAddress) {
    const FACTORY = await ethers.getContractFactory("DCRRaceFaucet");
    let contract
    if (DCR_ADDRESS) {
        contract = await upgrades.upgradeProxy(DCR_ADDRESS, FACTORY);

    } else {
        contract = await upgrades.deployProxy(FACTORY);
        let tx = await contract.setBetToken(tokenAddress)
        await tx.wait()
    }
    await contract.deployed();
    console.log("LAUNCHED ON ADDRESS ", contract.address)
    return contract;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
