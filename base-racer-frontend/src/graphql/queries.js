/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContestant = /* GraphQL */ `
  query GetContestant($id: ID!) {
    getContestant(id: $id) {
      name
      description
      image
      points
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listContestants = /* GraphQL */ `
  query ListContestants(
    $filter: ModelContestantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContestants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRequest = /* GraphQL */ `
  query GetRequest($id: ID!) {
    getRequest(id: $id) {
      betId
      bettorId
      raceId
      betType
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listRequests = /* GraphQL */ `
  query ListRequests(
    $filter: ModelRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        betId
        bettorId
        raceId
        betType
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBettor = /* GraphQL */ `
  query GetBettor($id: ID!) {
    getBettor(id: $id) {
      id
      balance
      username
      bets {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listBettors = /* GraphQL */ `
  query ListBettors(
    $filter: ModelBettorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBettors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        balance
        username
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLap = /* GraphQL */ `
  query GetLap($id: ID!) {
    getLap(id: $id) {
      raceId
      race {
        id
        name
        videoId
        startTime
        status
        first_winner_id
        second_winner_id
        third_winner_id
        fourth_winner_id
        totalTime
        createdAt
        updatedAt
        __typename
      }
      lapNumber
      first_winner_contestantId
      first_winner_contestant {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      second_winner_contestantId
      second_winner_contestant {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      third_winner_contestantId
      third_winner_contestant {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      fourth_winner_contestantId
      fourth_winner_contestant {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      totalTime
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLaps = /* GraphQL */ `
  query ListLaps(
    $filter: ModelLapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLaps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        raceId
        lapNumber
        first_winner_contestantId
        second_winner_contestantId
        third_winner_contestantId
        fourth_winner_contestantId
        totalTime
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBet = /* GraphQL */ `
  query GetBet($id: ID!) {
    getBet(id: $id) {
      raceId
      race {
        id
        name
        videoId
        startTime
        status
        first_winner_id
        second_winner_id
        third_winner_id
        fourth_winner_id
        totalTime
        createdAt
        updatedAt
        __typename
      }
      type
      amount
      bettor
      betterDetail {
        id
        balance
        username
        createdAt
        updatedAt
        __typename
      }
      contestantId
      contestant {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      ContestantBetOnPosition
      lapId
      lap {
        raceId
        lapNumber
        first_winner_contestantId
        second_winner_contestantId
        third_winner_contestantId
        fourth_winner_contestantId
        totalTime
        id
        createdAt
        updatedAt
        __typename
      }
      time
      betStatus
      betStatusUpdatedAt
      withdrawStatus
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listBets = /* GraphQL */ `
  query ListBets(
    $filter: ModelBetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        raceId
        type
        amount
        bettor
        contestantId
        ContestantBetOnPosition
        lapId
        time
        betStatus
        betStatusUpdatedAt
        withdrawStatus
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRace = /* GraphQL */ `
  query GetRace($id: ID!) {
    getRace(id: $id) {
      id
      bets {
        nextToken
        __typename
      }
      name
      contestants {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      videoId
      startTime
      status
      laps {
        nextToken
        __typename
      }
      first_winner_id
      first_winner {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      second_winner_id
      second_winner {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      third_winner_id
      third_winner {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      fourth_winner_id
      fourth_winner {
        name
        description
        image
        points
        id
        createdAt
        updatedAt
        __typename
      }
      totalTime
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listRaces = /* GraphQL */ `
  query ListRaces(
    $filter: ModelRaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRaces(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        videoId
        startTime
        status
        first_winner_id
        second_winner_id
        third_winner_id
        fourth_winner_id
        totalTime
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLiveChat = /* GraphQL */ `
  query GetLiveChat($id: ID!) {
    getLiveChat(id: $id) {
      id
      type
      owner
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLiveChats = /* GraphQL */ `
  query ListLiveChats(
    $filter: ModelLiveChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLiveChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        owner
        message
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const lapsByRaceId = /* GraphQL */ `
  query LapsByRaceId(
    $raceId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    lapsByRaceId(
      raceId: $raceId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        raceId
        lapNumber
        first_winner_contestantId
        second_winner_contestantId
        third_winner_contestantId
        fourth_winner_contestantId
        totalTime
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const betsByRaceId = /* GraphQL */ `
  query BetsByRaceId(
    $raceId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    betsByRaceId(
      raceId: $raceId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        raceId
        type
        amount
        bettor
        contestantId
        ContestantBetOnPosition
        lapId
        time
        betStatus
        betStatusUpdatedAt
        withdrawStatus
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const betByRaceIdAndContestantId = /* GraphQL */ `
  query BetByRaceIdAndContestantId(
    $raceId: ID!
    $contestantId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    betByRaceIdAndContestantId(
      raceId: $raceId
      contestantId: $contestantId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        raceId
        type
        amount
        bettor
        contestantId
        ContestantBetOnPosition
        lapId
        time
        betStatus
        betStatusUpdatedAt
        withdrawStatus
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const betByRaceIdAndType = /* GraphQL */ `
  query BetByRaceIdAndType(
    $raceId: ID!
    $type: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    betByRaceIdAndType(
      raceId: $raceId
      type: $type
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        raceId
        type
        amount
        bettor
        contestantId
        ContestantBetOnPosition
        lapId
        time
        betStatus
        betStatusUpdatedAt
        withdrawStatus
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const betByRaceIdAndLapId = /* GraphQL */ `
  query BetByRaceIdAndLapId(
    $raceId: ID!
    $lapId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    betByRaceIdAndLapId(
      raceId: $raceId
      lapId: $lapId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        raceId
        type
        amount
        bettor
        contestantId
        ContestantBetOnPosition
        lapId
        time
        betStatus
        betStatusUpdatedAt
        withdrawStatus
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const betsByBettor = /* GraphQL */ `
  query BetsByBettor(
    $bettor: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    betsByBettor(
      bettor: $bettor
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        raceId
        type
        amount
        bettor
        contestantId
        ContestantBetOnPosition
        lapId
        time
        betStatus
        betStatusUpdatedAt
        withdrawStatus
        winningAmount
        id
        createdAt
        updatedAt
        __typename
        contestant {
          id
          image
          name
          description
        }
        race {
          name
        }
      }
      nextToken
      __typename
    }
  }
`;
export const raceByStatusAndStartTime = /* GraphQL */ `
  query RaceByStatusAndStartTime(
    $status: ReceStatus!
    $startTime: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelRaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    raceByStatusAndStartTime(
      status: $status
      startTime: $startTime
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        currentLap
        lapBettingStatus
        raceStatus
        startTime
        status
        first_winner_id
        second_winner_id
        third_winner_id
        fourth_winner_id
        totalTime
        createdAt
        updatedAt
        __typename
        bets {
          items {
            ContestantBetOnPosition
            amount
            betStatus
            betStatusUpdatedAt
            bettor
            contestantId
            createdAt
            id
            lapId
            raceId
            time
            type
            updatedAt
            withdrawStatus
            betterDetail {
              username
              id
            }
          }
        }
        contestants {
          items {
            id
            raceId
            points
            contestantDetail {
              id
              image
              name
              description
            }
          }
        }
        laps {
          items {
            id
            lapNumber
            first_winner {
              id
              name
              image
            }
            fourth_winner {
              id
              name
              image
            }
            second_winner {
              id
              name
              image
            }
            third_winner {
              id
              name
              image
            }
          }
        }
      }
    }
  }
`;
export const livechatByDate = /* GraphQL */ `
  query LivechatByDate(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLiveChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    livechatByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        owner
        message
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
