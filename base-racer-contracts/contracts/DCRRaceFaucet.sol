// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract DCRRaceFaucet is Initializable, OwnableUpgradeable {
    using SafeMath for uint256;
    enum RaceStatus { SCHEDULED, CANCELLED, ONGOING, FINISHED }
    enum BetStatus { OPEN, CLOSE }
    enum BetResult { WIN, LOOSE, WAITING}
    enum BetType { RACE, LAP }


    address private constant DEAD_ADDRESS = address(0xdead);

    uint256 maxBet;
    uint256 public currentRaceId;
    uint256 public currentContestantId;
    uint256 public currentBetId;
    IERC20 betToken;


    modifier onlyAdmin() {
        require(admins[msg.sender]);
        _;
    }
    struct Contestant {
        string name;
        string description;
        uint id;
        string pic;
    }

    struct RaceResult {
        uint raceId;
        uint firstPlaceContestantId;
        uint secondPlaceContestantId;
        uint thirdPlaceContestantId;
        uint winnerPoints;
        bool finalResult;
    }

    struct LapResult {
        uint raceId;
        uint lap;
        uint firstPlaceContestantId;
        uint secondPlaceContestantId;
        uint thirdPlaceContestantId;
    }

    struct Bet {
        uint id;
        address bettor;
        uint raceId;
        uint lap;
        uint amount;
        uint contestantId;
        BetResult result;
        BetType betType;
        bool claimed;
    }

    struct Race {
        string name;
        uint laps;
        uint id;
        uint startTime;
        uint finishTime;
        uint currentLap;
        RaceStatus status;
        BetStatus betStatus;
        uint startingTimestamp;
        uint minBet;
        uint maxBet;
    }




    mapping (uint256 => mapping(uint256 => bool)) public raceContestants; //raceid -> contestantid -> is
    mapping (uint256 => mapping(uint => BetStatus)) public lapBetStatus;
    mapping(uint256 => Race) public races;
    mapping(uint256 => RaceResult) public raceResults;
    mapping(uint256 => mapping(uint => LapResult)) public lapResults;
    mapping(uint256 => Contestant) public contestants;
    mapping(address => bool) public admins;
    mapping(uint256 => mapping(address => Bet)) public raceBets; // raceid -> bettor -> bet
    mapping(uint256 => Bet) betByIds;
    mapping(uint256 => uint256) public totalRaceBet; // raceid -> amount
    mapping(uint256 => mapping(uint => uint256)) public totalLapBet; // raceid -> lap -> amount
    mapping(uint256 => mapping(uint => uint256)) public raceBetsCount; // raceid -> contestantid -> betsamount
    mapping(uint256 => mapping(uint => mapping(uint => uint256))) public lapBetsCount; // raceid -> lap -> contestantid -> betsamount
    uint256[3] public winPercents;
    mapping(uint256 => mapping(uint => uint256)) public raceContestantPoints; // raceid -> contestantid -> point
    mapping(uint256 => mapping(uint => mapping(uint => uint256))) public lapContestantPoints; // raceid -> lap -> contestantid -> point
    uint8 firstPoints;
    uint8 secondPoints;
    uint8 thirdPoints;
    mapping(uint256 => mapping(address => mapping(uint => mapping(uint => Bet)))) public lapContestantBets; // raceid -> bettor -> lap -> contestant -> bet
    mapping(uint256 => mapping(uint => uint256)) public totalRaceContestantBet; // raceid -> contestantid -> amount
    mapping(uint256 => mapping(uint => mapping(uint => uint256))) public totalLapContestantBet; // raceid -> lap -> contestantid -> amount



    event RaceCreated(uint256 indexed id, Race race);
    event RaceUpdated(uint256 indexed id, Race race);
    event RaceDeleted(uint256 indexed id);
    event ContestantCreated(uint256 indexed id, Contestant contestant);
    event ContestantUpdated(uint256 indexed id, Contestant contestant);
    event ContestantDeleted(uint256 indexed id);
    event ContestantRaceStatusChanged(uint256 indexed raceId, uint256 indexed contestantId, bool status);
    event ContestantRaceStatusChangedBatch(uint256 indexed raceId, uint256[] contestantIds, bool status);
    event BetCreated(uint256 indexed id, Bet bet);
    event BetUpdated(uint256 indexed id, Bet bet);
    event BetDeleted(uint256 indexed id, Bet bet);
    event RaceStarted(uint256 indexed raceId);
    event RaceFinished(uint256 indexed raceId, uint winnerId);
    event RaceLapStarted(uint256 indexed raceId, uint indexed lap);
    event LapFinished(uint256 indexed raceId, uint lap, uint first, uint second, uint third);
    event RaceRewardClaimed(uint256 indexed raceId, address participant, uint amount);
    event LapRewardClaimed(uint256 indexed raceId, uint lap, address participant, uint amount);
    event RaceCreatedWithContestants(uint256 indexed raceId, Race race, uint256[] contestantIds);
    event LapBetStatusChange(uint256 indexed raceId, uint indexed lap, BetStatus status);
    event RaceBetStatusChange(uint256 indexed raceId, BetStatus status);
    event RaceStatusChange(uint256 indexed raceId, RaceStatus status);




    function initialize() public initializer {
        super.__Ownable_init();
        maxBet = 1000000 * 1e18;
        admins[msg.sender] = true;
        winPercents = [65, 25, 5];
        firstPoints = 5;
        secondPoints = 3;
        thirdPoints = 1;
    }

    function prefill() internal {

    }

    function setBetToken(address newToken) external onlyOwner {
        betToken = IERC20(newToken);
    }

    function getBetToken() view external returns (address) {
        return address(betToken);
    }
    function createRaceWithContestants(string memory name, uint laps, uint minBet, uint maxBetAmount, uint256 startingTimestamp, uint256[] memory newContestantIds) public onlyAdmin {
        Race memory race = createRaceInternal(name, laps, startingTimestamp, minBet, maxBetAmount);
        uint256[] memory t = new uint256[](0);
        addContestantToRaceBatchInternal(t, newContestantIds, race.id);
        emit RaceCreatedWithContestants(race.id, race, newContestantIds);

    }
    function createRace(string memory name, uint laps, uint256 startingTimestamp, uint minBet, uint maxBetAmount) public onlyAdmin {
        Race memory race = createRaceInternal(name, laps, startingTimestamp, minBet, maxBetAmount);
        emit RaceCreated(race.id, race);
    }

    function createRaceInternal(string memory name, uint laps, uint256 startingTimestamp, uint minBet, uint maxBetAmount) private returns (Race memory) {
        uint256 raceId = ++currentRaceId;
        Race storage race = races[raceId];
        race.name = name;
        race.laps = laps;
        race.id = raceId;
        race.startingTimestamp = startingTimestamp;
        race.status = RaceStatus.SCHEDULED;
        race.betStatus = BetStatus.OPEN;
        race.minBet = minBet;
        race.maxBet = maxBetAmount;
        for (uint i = 1; i <= laps; i++) {
            if (i == 1) {
                lapBetStatus[raceId][i] = BetStatus.OPEN;
            } else {
                lapBetStatus[raceId][i] = BetStatus.CLOSE;
            }

        }
        return race;
    }

    function updateRace(uint256 raceId, string memory name, uint256 laps, uint256 startingTimestamp, uint minBet, uint maxBet) public onlyAdmin {
        Race storage race = races[raceId];
        require(race.id == raceId, "Race not exists");
        race.name = name;
        race.laps = laps;
        race.status = RaceStatus.SCHEDULED;
        race.startingTimestamp = startingTimestamp;
        race.minBet = minBet;
        race.maxBet = maxBet;
        emit RaceUpdated(raceId, race);
    }

    function setWinPercents(uint first, uint second, uint third) public onlyAdmin {
        winPercents = [first, second, third];
    }
    function setPoints(uint8 first, uint8 second, uint8 third) public onlyAdmin {
        firstPoints = first;
        secondPoints = second;
        thirdPoints = third;
    }

    function updateRaceWithContestants(uint256 raceId, string memory name, uint256 laps, uint minBet, uint maxBet, uint256 startingTimestamp, uint256[] memory oldContestantIds, uint256[] memory newContestantIds) public onlyAdmin {
        updateRace(raceId, name, laps, startingTimestamp, minBet, maxBet);
        addContestantToRaceBatch(oldContestantIds, newContestantIds, raceId);
    }

    function makeBet(uint raceId, uint contestantId, uint amount, bool fullRace, uint lap) public {
        require(amount <= maxBet, "amount should not exceed max bet");
        require(fullRace || lap > 0, "Invalid lap");

        betToken.transferFrom(msg.sender, address(this), amount);

        Race storage race = races[raceId];
        require(race.id == raceId, "Race not exists");
        require(amount >= race.minBet && amount <= race.maxBet, "Your bet is out of required range");
        Contestant storage contestant = contestants[contestantId];
        require(contestant.id == contestantId, "Contestant not exists");
        uint256 betId = ++currentBetId;
        Bet storage bet = betByIds[betId];
        bet.id = betId;
        bet.bettor = msg.sender;
        bet.amount = amount;
        bet.raceId = raceId;
        bet.contestantId = contestantId;
        if (fullRace) {
            require(race.status == RaceStatus.SCHEDULED, "Race must not be ongoing");
            require(race.betStatus == BetStatus.OPEN, "Bets on race must be open");
            require(raceBets[raceId][msg.sender].id == 0, "Your bet on race already created");
            bet.betType = BetType.RACE;
            raceBets[raceId][msg.sender] = bet;
            totalRaceBet[raceId] += amount;
            raceBetsCount[raceId][contestantId]++;
            totalRaceContestantBet[raceId][contestantId] += amount;
        } else {
            require(race.status == RaceStatus.SCHEDULED || race.status == RaceStatus.ONGOING, "Race bets can not be closed");
            require(race.laps >= lap, "You cant bet on invalid lap");
            require(lapBetStatus[raceId][lap] == BetStatus.OPEN, "Bets on lap must be open");
            require( lapContestantBets[raceId][msg.sender][lap][contestantId].id == 0, "Your bet on lap and contestant already created");
            bet.betType = BetType.LAP;
            bet.lap = lap;
            lapContestantBets[raceId][msg.sender][lap][contestantId] = bet;
            totalLapBet[raceId][lap] += amount;
            totalLapContestantBet[raceId][lap][contestantId] += amount;
            lapBetsCount[raceId][lap][contestantId]++;
        }
        emit BetCreated(betId, bet);
    }


    function getRaceResult(uint raceId, address participant) public view returns (uint) {
        RaceResult storage result = raceResults[raceId];
        require(result.firstPlaceContestantId > 0, "Race results unavailable");
        Bet storage bet = raceBets[raceId][participant];
        require(bet.amount > 0, "Bet was without amount");
        Race storage race = races[raceId];
        uint contestantBet = totalRaceContestantBet[raceId][bet.contestantId];
        uint totalBet = totalRaceBet[raceId];
        if (bet.contestantId == result.firstPlaceContestantId) {
            return calculateWinAmount(totalBet, contestantBet, bet.amount);
        }
        return 0;

    }

    function getLapResult(uint raceId, uint lap, address participant, uint contestantId) public view returns (uint) {
        LapResult storage result = lapResults[raceId][lap];
        require(result.firstPlaceContestantId > 0, "Lap results unavailable");
        Bet storage bet = lapContestantBets[raceId][participant][lap][contestantId];
        require(bet.amount > 0, "Bet was without amount");
        uint contestantBet = totalLapContestantBet[raceId][lap][bet.contestantId];
        uint totalBet = totalLapBet[raceId][lap];
        if (bet.contestantId == result.firstPlaceContestantId) {
            return calculateWinAmount(totalBet, contestantBet, bet.amount);
        }
        return 0;
    }

    function calculateWinAmount(uint totalBet, uint contestantBet, uint participantBet) private view returns (uint) {
        uint participantAmount = totalBet * participantBet / contestantBet;
        return participantAmount;
    }

    function claimRaceResult(uint raceId) public {
        Bet storage bet = raceBets[raceId][msg.sender];
        require(!bet.claimed, "Reward already claimed");
        uint amount = getRaceResult(raceId, msg.sender);
        bet.claimed = true;
        betToken.transfer(msg.sender, amount);
        emit RaceRewardClaimed(raceId, msg.sender, amount);
    }

    function claimLapResult(uint raceId, uint lap, uint contestantId) public {
        Bet storage bet = lapContestantBets[raceId][msg.sender][lap][contestantId];
        uint amount = getLapResult(raceId, lap, msg.sender, contestantId);
        bet.claimed = true;
        betToken.transfer(msg.sender, amount);
        emit LapRewardClaimed(raceId, lap, msg.sender, amount);
    }


    function deleteBet(uint betId) public onlyAdmin {
        Bet storage bet = betByIds[betId];
        require(bet.id > 0, "Bet not exists");
        if (bet.betType == BetType.LAP) {
            totalLapBet[bet.raceId][bet.lap] -= bet.amount;
            betToken.transfer(msg.sender, bet.amount);
            lapBetsCount[bet.raceId][bet.lap][bet.contestantId]--;
            totalLapContestantBet[bet.raceId][bet.lap][bet.contestantId] -= bet.amount;
            delete lapContestantBets[bet.raceId][bet.bettor][bet.lap][bet.contestantId];
        } else {
            totalRaceBet[bet.raceId] -= bet.amount;
            totalRaceContestantBet[bet.raceId][bet.contestantId] -= bet.amount;
            betToken.transfer(msg.sender, bet.amount);
            raceBetsCount[bet.raceId][bet.contestantId]--;
            delete raceBets[bet.raceId][bet.bettor];
        }
        emit BetDeleted(betId, bet);
        delete betByIds[betId];

    }

    function startRace(uint256 raceId) public onlyAdmin {
        Race storage race = races[raceId];
        require(race.id > 0, "Race not exists");
        race.betStatus = BetStatus.CLOSE;
        race.status = RaceStatus.ONGOING;
        race.startTime = block.timestamp;
        race.currentLap = 1;
        lapBetStatus[raceId][1] = BetStatus.CLOSE;

        RaceResult storage result = raceResults[raceId];
        result.raceId = raceId;
        result.finalResult = false;

        emit RaceStarted(raceId);
        emit RaceLapStarted(raceId, 1);

        emit RaceBetStatusChange(raceId, BetStatus.CLOSE);
        emit RaceStatusChange(raceId, RaceStatus.ONGOING);
        emit LapBetStatusChange(raceId, 1, BetStatus.CLOSE);
        if (race.laps > 1) {
            emit LapBetStatusChange(raceId, 2, BetStatus.OPEN);
            lapBetStatus[raceId][2] = BetStatus.OPEN;
        }


    }

    function startLap(uint256 raceId, uint lap) public onlyAdmin {
        Race storage race = races[raceId];
        require(race.id > 0, "Race not exists");
        require(race.laps >= lap, "Wrong Lap Num");
        require(lap > 1, "Lap should be next to 1");
        require(race.status == RaceStatus.ONGOING, "Race should be ongoing");
        race.currentLap = lap;
        lapBetStatus[raceId][lap] = BetStatus.CLOSE;
        emit RaceLapStarted(raceId, lap);
        emit LapBetStatusChange(raceId, lap, BetStatus.CLOSE);
        lapBetStatus[raceId][lap + 1] = BetStatus.OPEN;
        emit LapBetStatusChange(raceId, lap + 1, BetStatus.OPEN);

    }


    function setRaceResult(uint256 raceId) public onlyAdmin {
        RaceResult storage result = raceResults[raceId];
        require(result.raceId > 0, "Race result should be initiated");
        result.finalResult = true;

        Race storage race = races[raceId];
        require(race.currentLap == race.laps, "Race lap should be last");
        race.betStatus = BetStatus.CLOSE;
        race.status = RaceStatus.FINISHED;
        race.finishTime = block.timestamp;


        emit RaceFinished(raceId,  result.firstPlaceContestantId);
        emit RaceStatusChange(raceId, RaceStatus.FINISHED);
    }

    function setLapResult(uint256 raceId, uint lap, uint first, uint second, uint third) public onlyAdmin {
        LapResult storage result = lapResults[raceId][lap];
        require(result.raceId == 0, "You cant change existing result");
        Race storage race = races[raceId];
        race.currentLap = lap;
        result.raceId = raceId;
        result.lap = lap;
        result.firstPlaceContestantId = first;
        result.secondPlaceContestantId = second;
        result.thirdPlaceContestantId = third;
        lapBetStatus[raceId][lap] = BetStatus.CLOSE;

        lapContestantPoints[raceId][lap][first] = firstPoints;
        lapContestantPoints[raceId][lap][second] = secondPoints;
        lapContestantPoints[raceId][lap][third] = thirdPoints;

        raceContestantPoints[raceId][first] += firstPoints;
        raceContestantPoints[raceId][second] += secondPoints;
        raceContestantPoints[raceId][third] += thirdPoints;

        RaceResult storage raceResult = raceResults[raceId];
        require(raceResult.raceId > 0, "Race result should be initiated");

        if (raceContestantPoints[raceId][first] > raceResult.winnerPoints) {
            raceResult.winnerPoints = raceContestantPoints[raceId][first];
            raceResult.firstPlaceContestantId = first;
        }
        if (raceContestantPoints[raceId][second] > raceResult.winnerPoints) {
            raceResult.winnerPoints = raceContestantPoints[raceId][second];
            raceResult.firstPlaceContestantId = second;
        }
        if (raceContestantPoints[raceId][third] > raceResult.winnerPoints) {
            raceResult.winnerPoints = raceContestantPoints[raceId][third];
            raceResult.firstPlaceContestantId = third;
        }

        emit LapFinished(raceId, lap, first, second, third);
        emit LapBetStatusChange(raceId, lap, BetStatus.CLOSE);
        lapBetStatus[raceId][lap + 1] = BetStatus.OPEN;
    }

    function addContestant(string memory name, string memory desc, string memory pic) public onlyAdmin returns(Contestant memory) {
        uint256 contestantId = ++currentContestantId;
        Contestant storage contestant = contestants[contestantId];
        contestant.name = name;
        contestant.description = desc;
        contestant.pic = pic;
        contestant.id = contestantId;
        emit ContestantCreated(contestantId, contestant);
        return contestant;
    }

    function updateContestant(uint256 contestantId, string memory name, string memory desc, string memory pic) public onlyAdmin{
        Contestant storage contestant = contestants[contestantId];
        require(contestant.id == contestantId, "Contestant not exists");
        contestant.name = name;
        contestant.description = desc;
        contestant.pic = pic;
        emit ContestantUpdated(contestantId, contestant);
    }

    function deleteContestant(uint256 contestantId) public onlyAdmin {
        delete contestants[contestantId];
        emit ContestantDeleted(contestantId);
    }

    function deleteRace(uint256 raceId) public onlyAdmin {
        delete races[raceId];
        emit RaceDeleted(raceId);
    }

    function addContestantToRace(uint256 contestantId, uint256 raceId, bool status) public onlyAdmin {
        require(contestants[contestantId].id > 0, "Contestant not exists");
        require(races[raceId].id > 0, "Race not exists");
        raceContestants[raceId][contestantId] = status;
        emit ContestantRaceStatusChanged(raceId, contestantId, status);
    }

    function addContestantToRaceBatch(uint256[] memory oldContestantIds, uint256[] memory newContestantIds, uint256 raceId) public onlyAdmin {
        addContestantToRaceBatchInternal(oldContestantIds, newContestantIds, raceId);
        emit ContestantRaceStatusChangedBatch(raceId, newContestantIds, true);
    }

    function addContestantToRaceBatchInternal(uint256[] memory oldContestantIds, uint256[] memory newContestantIds, uint256 raceId) private {
        require(races[raceId].id > 0, "Race not exists");
        for(uint i = 0; i < oldContestantIds.length; i++) {
            require(contestants[oldContestantIds[i]].id > 0, "Contestant not exists");
            raceContestants[raceId][oldContestantIds[i]] = false;
        }
        for(uint i = 0; i < newContestantIds.length; i++) {
            require(contestants[newContestantIds[i]].id > 0, "Contestant not exists");
            raceContestants[raceId][newContestantIds[i]] = true;
        }
    }

    function updateAdmin(address addr, bool setAdmin) public onlyOwner {
        admins[addr] = setAdmin;
    }


}