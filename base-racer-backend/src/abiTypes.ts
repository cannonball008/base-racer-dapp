import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

type BigNumber = BigInt

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
  | 'LapFinished'
  | 'OwnershipTransferred'
  | 'RaceCreated'
  | 'RaceDeleted'
  | 'RaceFinished'
  | 'RaceLapStarted'
  | 'RaceStarted'
  | 'RaceRewardClaimed'
  | 'LapRewardClaimed'
  | 'RaceCreatedWithContestants'
  | 'LapBetStatusChange'
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
  LapFinished(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  RaceCreated(...parameters: any): EventFilter;
  RaceDeleted(...parameters: any): EventFilter;
  RaceFinished(...parameters: any): EventFilter;
  RaceLapStarted(...parameters: any): EventFilter;
  RaceStarted(...parameters: any): EventFilter;
  RaceUpdated(...parameters: any): EventFilter;
}
export type AbiMethodNames =
  | 'new'
  | 'addContestant'
  | 'addContestantToRace'
  | 'addContestantToRaceBatch'
  | 'admins'
  | 'contestants'
  | 'createRace'
  | 'currentBetId'
  | 'currentContestantId'
  | 'currentRaceId'
  | 'deleteBet'
  | 'deleteContestant'
  | 'deleteRace'
  | 'lapBetStatus'
  | 'lapBets'
  | 'lapResults'
  | 'makeBet'
  | 'owner'
  | 'raceBets'
  | 'raceContestants'
  | 'raceResults'
  | 'races'
  | 'renounceOwnership'
  | 'setLapResult'
  | 'setRaceResult'
  | 'startLap'
  | 'startRace'
  | 'transferOwnership'
  | 'updateAdmin'
  | 'updateContestant'
  | 'updateRace';
export interface RaceEventEmittedResponse {
  id: BigNumberish;
  bettor: string;
  raceId: BigNumberish;
  lap: BigNumberish;
  amount: BigNumberish;
  contestantId: BigNumberish;
  result: BigNumberish;
  betType: BigNumberish;
}
export interface BetCreatedEventEmittedResponse {
  id: BigNumberish;
  race: RaceEventEmittedResponse;
}
export interface BetDeletedEventEmittedResponse {
  id: BigNumberish;
}
export interface BetUpdatedEventEmittedResponse {
  id: BigNumberish;
  race: RaceEventEmittedResponse;
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
export interface LapFinishedEventEmittedResponse {
  raceId: BigNumberish;
  lap: BigNumberish;
  first: BigNumberish;
  second: BigNumberish;
  third: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface RaceCreatedEventEmittedResponse {
  id: BigNumberish;
  race: RaceEventEmittedResponse;
}
export interface RaceDeletedEventEmittedResponse {
  id: BigNumberish;
}
export interface RaceFinishedEventEmittedResponse {
  raceId: BigNumberish;
  first: BigNumberish;
  second: BigNumberish;
  third: BigNumberish;
}
export interface RaceLapStartedEventEmittedResponse {
  raceId: BigNumberish;
  lap: BigNumberish;
}
export interface RaceStartedEventEmittedResponse {
  raceId: BigNumberish;
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
export interface LapBetsResponse {
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
  length: 8;
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
  claimed: boolean;
  7: number;
  length: 8;
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
  length: 4;
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
  maxBet: BigNumber;
  length: 9;
}
export interface Abi {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
   * @param contestantIds Type: uint256[], Indexed: false
   * @param raceId Type: uint256, Indexed: false
   * @param status Type: bool, Indexed: false
   */
  addContestantToRaceBatch(
    contestantIds: BigNumberish[],
    raceId: BigNumberish,
    status: boolean,
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
   */
  createRace(
    name: string,
    laps: BigNumberish,
    startingTimestamp: BigNumberish,
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
   * @param parameter1 Type: address, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   */
  lapBets(
    parameter0: BigNumberish,
    parameter1: string,
    parameter2: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<LapBetsResponse>;
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
   * @param raceId Type: uint256, Indexed: false
   * @param first Type: uint256, Indexed: false
   * @param second Type: uint256, Indexed: false
   * @param third Type: uint256, Indexed: false
   */
  setRaceResult(
    raceId: BigNumberish,
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
   * @param laps Type: uint8, Indexed: false
   * @param startingTimestamp Type: uint256, Indexed: false
   */
  updateRace(
    raceId: BigNumberish,
    name: string,
    laps: BigNumberish,
    startingTimestamp: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
