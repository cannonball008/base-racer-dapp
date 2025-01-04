// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {ethers, upgrades, waffle} = require("hardhat");
const {use} = require("chai");
const ABI = require("../artifacts/contracts/DCRRaceFaucet.sol/DCRRaceFaucet.json").abi;
const ERC20ABI = require("../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json").abi;
let deployedAddress= null
let tokenContract, ca


async function logPoints(contestantIds, raceId, actualPoints) {
    console.log()
    console.log("POINTS")
    for (let i = 0; i < contestantIds.length; i++) {
        console.log("Contestant", '' + contestantIds[i], " / ", (await ca.raceContestantPoints(raceId, contestantIds[i])).toNumber(), " / ", actualPoints[i])
    }
    console.log("----------------\n")
}

async function setRaceResult(raceId, raceBets, contestantIds, users) {
    await ca.setRaceResult(raceId);
    let totalBet = 0;
    for (let i = 0; i < raceBets.length; i++) {
        for (let j = 0; j < raceBets[i].length; j++) {
            totalBet += raceBets[i][j]
        }
    }
    let winner = (await ca.raceResults(raceId))['firstPlaceContestantId'].toNumber()
    let winnerPoints = (await ca.raceResults(raceId))['winnerPoints'].toNumber()
    console.log("Winner contestant ", winner, winnerPoints);
    console.log("RACE RESULTS ", " / ", "TOTAL BET ", totalBet)
    for (let i = 0; i < contestantIds.length; i++) {
        console.log("Contestant", '' + contestantIds[i], " / ", "BET ", (raceBets[i].reduce((s, a) => s + a, 0)), contestantIds[i] == winner ? "WINNER" : "");

        let usersBet = users[i]
        for (let j = 0; j < usersBet.length; j++) {
            let res = await ca.getRaceResult(raceId, users[i][j].address)

            console.log("\tUser: " + usersBet[j].address, "Win: ", ethers.utils.formatEther(res), "Bet", raceBets[i][j])
            await ca.connect(usersBet[j]).claimRaceResult(raceId)
        }
    }
}

async function main() {
    const [deployer, ...accs] = await ethers.getSigners();
    if (deployedAddress) {
        ca = new ethers.Contract(deployedAddress, ABI, deployer)
        tokenContract = new ethers.Contract(await ca.getBetToken(), ERC20ABI, deployer)
    } else {
        await deployProxy()
    }

    let bets = [[100, 300], [1000], [500], [400]]
    let raceBets = [[300, 1000], [800], [100], [1000]]
    let users = await initUsers(bets);
    for (const usrs of users) {
        for (const usr of usrs) {
            await tokenContract.transfer(usr.address, ethers.utils.parseEther("10000"))
        }
    }
    let contestantIds = await createContestants(4);
    let raceId = await createRace(contestantIds)
    await betOnRace(contestantIds, raceBets, users, raceId)
    let points = [0, 0, 0, 0]
    for (let i = 1 ; i <= 4; i++) {
        let result = await runLap(contestantIds, bets, users, raceId, i);
        for (let j = 0; j < 4; j++) {
            points[j] += result[j]
        }
        await logPoints(contestantIds, raceId, points);
    }
    await setRaceResult(raceId, raceBets, contestantIds, users);
    await logPoints(contestantIds, raceId, points);

}
async function initUsers(bets) {
    let users = []
    for (let i = 0; i < bets.length; i++) {
        let curUsers = []
        for (let j = 0; j < bets[i].length; j++) {
            curUsers.push(await generateRandomWallet());
        }
        users.push(curUsers)
    }
    return users;
}

async function betOnRace(contestantIds, bets, users, raceId) {
    for (let i = 0; i < contestantIds.length; i++) {
        let contestantBets = bets[i]
        for (let j = 0; j < contestantBets.length; j++) {
            await makeBet(users[i][j], raceId, contestantIds[i], ethers.utils.parseEther('' + contestantBets[j]), 0)
        }
    }
}
async function runLap(contestantIds, bets, users, raceId, lapNum) {
    let totalBet = 0;
    let points = [0, 0, 0, 0]
    for (let i = 0; i < bets.length; i++) {
        for (let j = 0; j < bets[i].length; j++) {
            totalBet += bets[i][j]
        }
    }
    let results = shuffle(contestantIds)
    points[results[0] - 1] += 5;
    points[results[1] - 1] += 3;
    points[results[2] - 1] += 1;
    console.log()
    console.log("RUN LAP ", lapNum, " / ", "TOTAL BET ", totalBet)
    console.log("----------------")
    for (let i = 0; i < contestantIds.length; i++) {
        let contestantBets = bets[i]
        for (let j = 0; j < contestantBets.length; j++) {
            await makeBet(users[i][j], raceId, contestantIds[i], ethers.utils.parseEther('' + contestantBets[j]), lapNum)
        }
    }
    await ca.startRace(raceId)
    if (lapNum > 1) {
        await ca.startLap(raceId, lapNum)
    }
    await ca.setLapResult(raceId, lapNum, results[0], results[1], results[2])
    for (let i = 0; i < contestantIds.length; i++) {
        console.log("Contestant",'' + contestantIds[i]," / ","BET ",(bets[i].reduce((s, a) => s + a, 0)), contestantIds[i] === results[0] ? "WINNER" : "");

        let usersBet = users[i]
        for (let j = 0; j < usersBet.length; j++) {
                let res = await ca.getLapResult(raceId, lapNum, users[i][j].address, contestantIds[i])

            console.log("\tUser: " + usersBet[j].address, "Win: ",  ethers.utils.formatEther(res), "Bet", bets[i][j])
            await ca.connect(usersBet[j]).claimLapResult(raceId, lapNum, contestantIds[i])
        }
    }

    return points;
}

async function generateRandomWallet(){
    // Connect to Hardhat Provider
    const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    // Set balance
    await ethers.provider.send("hardhat_setBalance", [
        wallet.address,
        "0x56BC75E2D63100000", // 100 ETH
    ]);
    return wallet;
}
async function makeBet(user, raceId, contestantId, amount, lap = 0) {
    await tokenContract.connect(user).approve(ca.address, ethers.utils.parseEther('10000000000000'))
    await ca.connect(user).makeBet(raceId, contestantId, amount, lap === 0, lap)
}

async function createContestants(n) {
    let contestants = []
    for (let i = 1; i<=n; i++) {
        let tx = await ca.addContestant("Contestant" + i, "", "")
        contestants.push(await extractEventValue(tx, "ContestantCreated", 0))
    }
    return contestants

}
async function createRace(contestantIds) {
    let tx = await ca.createRaceWithContestants("Race", 4, ethers.utils.parseEther('100'), ethers.utils.parseEther('10000'), 10000000, contestantIds)
    return await extractEventValue(tx, "RaceCreatedWithContestants", 0)
}

async function extractEventValue(tx, eventName, argId) {
    let rc = await tx.wait()
    const event = rc.events.find(event => event.event === eventName);
    return event.args[argId]
}
async function deployProxy() {
    tokenContract = await deployToken()
    const FACTORY = await ethers.getContractFactory("DCRRaceFaucet");
    ca = await upgrades.deployProxy(FACTORY);
    let tx = await ca.setBetToken(tokenContract.address)
    await tx.wait()
   // ca = await upgrades.upgradeProxy("0xa74C7515d81F1448f442cc9519a6db5b146444E5", FACTORY);
    await ca.deployed();
    tx = await ca.setPoints(5, 3, 1);
    await tx.wait()
    return ca;
}

async function deployToken() {
    const FACTORY = await ethers.getContractFactory("DCRToken");
    const contract = await FACTORY.deploy()
    await contract.deployTransaction.wait();
    deployedAddress = contract.address
    return contract;
}

function shuffle(arr) {
    let array = []
    for (let i = 0; i < arr.length; i++) {
        array.push(arr[i])
    }

    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
