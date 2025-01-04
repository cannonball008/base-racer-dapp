import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContext<
  Abi,
  AbiEventsContext,
  AbiEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type AbiEvents =
  | 'BetCreated'
  | 'BetDeleted'
  | 'BetUpdated'
  | 'ContestantCreated'
  | 'ContestantDeleted'
  | 'ContestantRaceStatusChanged'
  | 'ContestantRaceStatusChangedBatch'
  | 'ContestantUpdated'
  | 'Initialized'
  | 'LapBetStatusChange'
  | 'LapFinished'
  | 'LapRewardClaimed'
  | 'OwnershipTransferred'
  | 'RaceBetStatusChange'
  | 'RaceCreated'
  | 'RaceCreatedWithContestants'
  | 'RaceDeleted'
  | 'RaceFinished'
  | 'RaceLapStarted'
  | 'RaceRewardClaimed'
  | 'RaceStarted'
  | 'RaceStatusChange'
  | 'RaceUpdated';
export interface AbiEventsContext {
  BetCreated(...parameters: any): EventFilter;
  BetDeleted(...parameters: any): EventFilter;
  BetUpdated(...parameters: any): EventFilter;
  ContestantCreated(...parameters: any): EventFilter;
  ContestantDeleted(...parameters: any): EventFilter;
  ContestantRaceStatusChanged(...parameters: any): EventFilter;
  ContestantRaceStatusChangedBatch(...parameters: any): EventFilter;
  ContestantUpdated(...parameters: any): EventFilter;
  Initialized(...parameters: any): EventFilter;
  LapBetStatusChange(...parameters: any): EventFilter;
  LapFinished(...parameters: any): EventFilter;
  LapRewardClaimed(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  RaceBetStatusChange(...parameters: any): EventFilter;
  RaceCreated(...parameters: any): EventFilter;
  RaceCreatedWithContestants(...parameters: any): EventFilter;
  RaceDeleted(...parameters: any): EventFilter;
  RaceFinished(...parameters: any): EventFilter;
  RaceLapStarted(...parameters: any): EventFilter;
  RaceRewardClaimed(...parameters: any): EventFilter;
  RaceStarted(...parameters: any): EventFilter;
  RaceStatusChange(...parameters: any): EventFilter;
  RaceUpdated(...parameters: any): EventFilter;
}
export type AbiMethodNames =
  | 'addContestant'
  | 'addContestantToRace'
  | 'addContestantToRaceBatch'
  | 'admins'
  | 'claimLapResult'
  | 'claimRaceResult'
  | 'contestants'
  | 'createRace'
  | 'createRaceWithContestants'
  | 'currentBetId'
  | 'currentContestantId'
  | 'currentRaceId'
  | 'deleteBet'
  | 'deleteContestant'
  | 'deleteRace'
  | 'getLapResult'
  | 'getRaceResult'
  | 'initialize'
  | 'lapBetStatus'
  | 'lapBetsCount'
  | 'lapContestantBets'
  | 'lapContestantPoints'
  | 'lapResults'
  | 'makeBet'
  | 'owner'
  | 'raceBets'
  | 'raceBetsCount'
  | 'raceContestantPoints'
  | 'raceContestants'
  | 'raceResults'
  | 'races'
  | 'renounceOwnership'
  | 'setLapResult'
  | 'setPoints'
  | 'setRaceResult'
  | 'setWinPercents'
  | 'startLap'
  | 'startRace'
  | 'totalLapBet'
  | 'totalLapContestantBet'
  | 'totalRaceBet'
  | 'totalRaceContestantBet'
  | 'transferOwnership'
  | 'updateAdmin'
  | 'updateContestant'
  | 'updateRace'
  | 'updateRaceWithContestants'
  | 'winPercents';
export interface BetEventEmittedResponse {
  id: BigNumberish;
  bettor: string;
  raceId: BigNumberish;
  lap: BigNumberish;
  amount: BigNumberish;
  contestantId: BigNumberish;
  result: BigNumberish;
  betType: BigNumberish;
  claimed: boolean;
}
export interface BetCreatedEventEmittedResponse {
  id: BigNumberish;
  bet: BetEventEmittedResponse;
}
export interface BetDeletedEventEmittedResponse {
  id: BigNumberish;
  bet: BetEventEmittedResponse;
}
export interface BetUpdatedEventEmittedResponse {
  id: BigNumberish;
  bet: BetEventEmittedResponse;
}
export interface ContestantEventEmittedResponse {
  name: string;
  description: string;
  id: BigNumberish;
  pic: string;
}
export interface ContestantCreatedEventEmittedResponse {
  id: BigNumberish;
  contestant: ContestantEventEmittedResponse;
}
export interface ContestantDeletedEventEmittedResponse {
  id: BigNumberish;
}
export interface ContestantRaceStatusChangedEventEmittedResponse {
  raceId: BigNumberish;
  contestantId: BigNumberish;
  status: boolean;
}
export interface ContestantRaceStatusChangedBatchEventEmittedResponse {
  raceId: BigNumberish;
  contestantIds: BigNumberish[];
  status: boolean;
}
export interface ContestantUpdatedEventEmittedResponse {
  id: BigNumberish;
  contestant: ContestantEventEmittedResponse;
}
export interface InitializedEventEmittedResponse {
  version: BigNumberish;
}
export interface LapBetStatusChangeEventEmittedResponse {
  raceId: BigNumberish;
  lap: BigNumberish;
  status: BigNumberish;
}
export interface LapFinishedEventEmittedResponse {
  raceId: BigNumberish;
  lap: BigNumberish;
  first: BigNumberish;
  second: BigNumberish;
  third: BigNumberish;
}
export interface LapRewardClaimedEventEmittedResponse {
  raceId: BigNumberish;
  lap: BigNumberish;
  participant: string;
  amount: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface RaceBetStatusChangeEventEmittedResponse {
  raceId: BigNumberish;
  status: BigNumberish;
}
export interface RaceEventEmittedResponse {
  name: string;
  laps: BigNumberish;
  id: BigNumberish;
  startTime: BigNumberish;
  finishTime: BigNumberish;
  currentLap: BigNumberish;
  status: BigNumberish;
  betStatus: BigNumberish;
  startingTimestamp: BigNumberish;
  minBet: BigNumberish;
  maxBet: BigNumberish;
}
export interface RaceCreatedEventEmittedResponse {
  id: BigNumberish;
  race: RaceEventEmittedResponse;
}
export interface RaceCreatedWithContestantsEventEmittedResponse {
  raceId: BigNumberish;
  race: RaceEventEmittedResponse;
  contestantIds: BigNumberish[];
}
export interface RaceDeletedEventEmittedResponse {
  id: BigNumberish;
}
export interface RaceFinishedEventEmittedResponse {
  raceId: BigNumberish;
  winnerId: BigNumberish;
}
export interface RaceLapStartedEventEmittedResponse {
  raceId: BigNumberish;
  lap: BigNumberish;
}
export interface RaceRewardClaimedEventEmittedResponse {
  raceId: BigNumberish;
  participant: string;
  amount: BigNumberish;
}
export interface RaceStartedEventEmittedResponse {
  raceId: BigNumberish;
}
export interface RaceStatusChangeEventEmittedResponse {
  raceId: BigNumberish;
  status: BigNumberish;
}
export interface RaceUpdatedEventEmittedResponse {
  id: BigNumberish;
  race: RaceEventEmittedResponse;
}
export interface ContestantsResponse {
  name: string;
  0: string;
  description: string;
  1: string;
  id: BigNumber;
  2: BigNumber;
  pic: string;
  3: string;
  length: 4;
}
export interface LapContestantBetsResponse {
  id: BigNumber;
  0: BigNumber;
  bettor: string;
  1: string;
  raceId: BigNumber;
  2: BigNumber;
  lap: BigNumber;
  3: BigNumber;
  amount: BigNumber;
  4: BigNumber;
  contestantId: BigNumber;
  5: BigNumber;
  result: number;
  6: number;
  betType: number;
  7: number;
  claimed: boolean;
  8: boolean;
  length: 9;
}
export interface LapResultsResponse {
  raceId: BigNumber;
  0: BigNumber;
  lap: BigNumber;
  1: BigNumber;
  firstPlaceContestantId: BigNumber;
  2: BigNumber;
  secondPlaceContestantId: BigNumber;
  3: BigNumber;
  thirdPlaceContestantId: BigNumber;
  4: BigNumber;
  length: 5;
}
export interface RaceBetsResponse {
  id: BigNumber;
  0: BigNumber;
  bettor: string;
  1: string;
  raceId: BigNumber;
  2: BigNumber;
  lap: BigNumber;
  3: BigNumber;
  amount: BigNumber;
  4: BigNumber;
  contestantId: BigNumber;
  5: BigNumber;
  result: number;
  6: number;
  betType: number;
  7: number;
  claimed: boolean;
  8: boolean;
  length: 9;
}
export interface RaceResultsResponse {
  raceId: BigNumber;
  0: BigNumber;
  firstPlaceContestantId: BigNumber;
  1: BigNumber;
  secondPlaceContestantId: BigNumber;
  2: BigNumber;
  thirdPlaceContestantId: BigNumber;
  3: BigNumber;
  winnerPoints: BigNumber;
  4: BigNumber;
  finalResult: boolean;
  5: boolean;
  length: 6;
}
export interface RacesResponse {
  name: string;
  0: string;
  laps: BigNumber;
  1: BigNumber;
  id: BigNumber;
  2: BigNumber;
  startTime: BigNumber;
  3: BigNumber;
  finishTime: BigNumber;
  4: BigNumber;
  currentLap: BigNumber;
  5: BigNumber;
  status: number;
  6: number;
  betStatus: number;
  7: number;
  startingTimestamp: BigNumber;
  8: BigNumber;
  minBet: BigNumber;
  9: BigNumber;
  maxBet: BigNumber;
  10: BigNumber;
  length: 11;
}
export interface Abi {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param desc Type: string, Indexed: false
   * @param pic Type: string, Indexed: false
   */
  addContestant(
    name: string,
    desc: string,
    pic: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param contestantId Type: uint256, Indexed: false
   * @param raceId Type: uint256, Indexed: false
   * @param status Type: bool, Indexed: false
   */
  addContestantToRace(
    contestantId: BigNumberish,
    raceId: BigNumberish,
    status: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param oldContestantIds Type: uint256[], Indexed: false
   * @param newContestantIds Type: uint256[], Indexed: false
   * @param raceId Type: uint256, Indexed: false
   */
  addContestantToRaceBatch(
    oldContestantIds: BigNumberish[],
    newContestantIds: BigNumberish[],
    raceId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  admins(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param lap Type: uint256, Indexed: false
   * @param contestantId Type: uint256, Indexed: false
   */
  claimLapResult(
    raceId: BigNumberish,
    lap: BigNumberish,
    contestantId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   */
  claimRaceResult(
    raceId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  contestants(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ContestantsResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param laps Type: uint256, Indexed: false
   * @param startingTimestamp Type: uint256, Indexed: false
   * @param minBet Type: uint256, Indexed: false
   * @param maxBet Type: uint256, Indexed: false
   */
  createRace(
    name: string,
    laps: BigNumberish,
    startingTimestamp: BigNumberish,
    minBet: BigNumberish,
    maxBet: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param laps Type: uint256, Indexed: false
   * @param minBet Type: uint256, Indexed: false
   * @param maxBet Type: uint256, Indexed: false
   * @param startingTimestamp Type: uint256, Indexed: false
   * @param newContestantIds Type: uint256[], Indexed: false
   */
  createRaceWithContestants(
    name: string,
    laps: BigNumberish,
    minBet: BigNumberish,
    maxBet: BigNumberish,
    startingTimestamp: BigNumberish,
    newContestantIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  currentBetId(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  currentContestantId(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  currentRaceId(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param betId Type: uint256, Indexed: false
   */
  deleteBet(
    betId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param contestantId Type: uint256, Indexed: false
   */
  deleteContestant(
    contestantId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   */
  deleteRace(
    raceId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param lap Type: uint256, Indexed: false
   * @param participant Type: address, Indexed: false
   * @param contestantId Type: uint256, Indexed: false
   */
  getLapResult(
    raceId: BigNumberish,
    lap: BigNumberish,
    participant: string,
    contestantId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param participant Type: address, Indexed: false
   */
  getRaceResult(
    raceId: BigNumberish,
    participant: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  initialize(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  lapBetStatus(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   */
  lapBetsCount(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    parameter2: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   * @param parameter3 Type: uint256, Indexed: false
   */
  lapContestantBets(
    parameter0: BigNumberish,
    parameter1: string,
    parameter2: BigNumberish,
    parameter3: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<LapContestantBetsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   */
  lapContestantPoints(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    parameter2: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  lapResults(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<LapResultsResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param contestantId Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param fullRace Type: bool, Indexed: false
   * @param lap Type: uint256, Indexed: false
   */
  makeBet(
    raceId: BigNumberish,
    contestantId: BigNumberish,
    amount: BigNumberish,
    fullRace: boolean,
    lap: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  raceBets(
    parameter0: BigNumberish,
    parameter1: string,
    overrides?: ContractCallOverrides
  ): Promise<RaceBetsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  raceBetsCount(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  raceContestantPoints(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  raceContestants(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  raceResults(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<RaceResultsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  races(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<RacesResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param lap Type: uint256, Indexed: false
   * @param first Type: uint256, Indexed: false
   * @param second Type: uint256, Indexed: false
   * @param third Type: uint256, Indexed: false
   */
  setLapResult(
    raceId: BigNumberish,
    lap: BigNumberish,
    first: BigNumberish,
    second: BigNumberish,
    third: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param first Type: uint8, Indexed: false
   * @param second Type: uint8, Indexed: false
   * @param third Type: uint8, Indexed: false
   */
  setPoints(
    first: BigNumberish,
    second: BigNumberish,
    third: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   */
  setRaceResult(
    raceId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param first Type: uint256, Indexed: false
   * @param second Type: uint256, Indexed: false
   * @param third Type: uint256, Indexed: false
   */
  setWinPercents(
    first: BigNumberish,
    second: BigNumberish,
    third: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param lap Type: uint256, Indexed: false
   */
  startLap(
    raceId: BigNumberish,
    lap: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   */
  startRace(
    raceId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  totalLapBet(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   */
  totalLapContestantBet(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    parameter2: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  totalRaceBet(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  totalRaceContestantBet(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param addr Type: address, Indexed: false
   * @param setAdmin Type: bool, Indexed: false
   */
  updateAdmin(
    addr: string,
    setAdmin: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param contestantId Type: uint256, Indexed: false
   * @param name Type: string, Indexed: false
   * @param desc Type: string, Indexed: false
   * @param pic Type: string, Indexed: false
   */
  updateContestant(
    contestantId: BigNumberish,
    name: string,
    desc: string,
    pic: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param name Type: string, Indexed: false
   * @param laps Type: uint256, Indexed: false
   * @param startingTimestamp Type: uint256, Indexed: false
   * @param minBet Type: uint256, Indexed: false
   * @param maxBet Type: uint256, Indexed: false
   */
  updateRace(
    raceId: BigNumberish,
    name: string,
    laps: BigNumberish,
    startingTimestamp: BigNumberish,
    minBet: BigNumberish,
    maxBet: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param raceId Type: uint256, Indexed: false
   * @param name Type: string, Indexed: false
   * @param laps Type: uint256, Indexed: false
   * @param minBet Type: uint256, Indexed: false
   * @param maxBet Type: uint256, Indexed: false
   * @param startingTimestamp Type: uint256, Indexed: false
   * @param oldContestantIds Type: uint256[], Indexed: false
   * @param newContestantIds Type: uint256[], Indexed: false
   */
  updateRaceWithContestants(
    raceId: BigNumberish,
    name: string,
    laps: BigNumberish,
    minBet: BigNumberish,
    maxBet: BigNumberish,
    startingTimestamp: BigNumberish,
    oldContestantIds: BigNumberish[],
    newContestantIds: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  winPercents(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
}
