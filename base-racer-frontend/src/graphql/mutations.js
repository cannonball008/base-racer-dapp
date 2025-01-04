/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createContestant = /* GraphQL */ `
  mutation CreateContestant(
    $input: CreateContestantInput!
    $condition: ModelContestantConditionInput
  ) {
    createContestant(input: $input, condition: $condition) {
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
export const updateContestant = /* GraphQL */ `
  mutation UpdateContestant(
    $input: UpdateContestantInput!
    $condition: ModelContestantConditionInput
  ) {
    updateContestant(input: $input, condition: $condition) {
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
export const deleteContestant = /* GraphQL */ `
  mutation DeleteContestant(
    $input: DeleteContestantInput!
    $condition: ModelContestantConditionInput
  ) {
    deleteContestant(input: $input, condition: $condition) {
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
export const createRequest = /* GraphQL */ `
  mutation CreateRequest(
    $input: CreateRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    createRequest(input: $input, condition: $condition) {
      bettorId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateRequest = /* GraphQL */ `
  mutation UpdateRequest(
    $input: UpdateRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    updateRequest(input: $input, condition: $condition) {
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
export const deleteRequest = /* GraphQL */ `
  mutation DeleteRequest(
    $input: DeleteRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    deleteRequest(input: $input, condition: $condition) {
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
export const createBettor = /* GraphQL */ `
  mutation CreateBettor(
    $input: CreateBettorInput!
    $condition: ModelBettorConditionInput
  ) {
    createBettor(input: $input, condition: $condition) {
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
export const updateBettor = /* GraphQL */ `
  mutation UpdateBettor(
    $input: UpdateBettorInput!
    $condition: ModelBettorConditionInput
  ) {
    updateBettor(input: $input, condition: $condition) {
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
export const deleteBettor = /* GraphQL */ `
  mutation DeleteBettor(
    $input: DeleteBettorInput!
    $condition: ModelBettorConditionInput
  ) {
    deleteBettor(input: $input, condition: $condition) {
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
export const createLap = /* GraphQL */ `
  mutation CreateLap(
    $input: CreateLapInput!
    $condition: ModelLapConditionInput
  ) {
    createLap(input: $input, condition: $condition) {
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
export const updateLap = /* GraphQL */ `
  mutation UpdateLap(
    $input: UpdateLapInput!
    $condition: ModelLapConditionInput
  ) {
    updateLap(input: $input, condition: $condition) {
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
export const deleteLap = /* GraphQL */ `
  mutation DeleteLap(
    $input: DeleteLapInput!
    $condition: ModelLapConditionInput
  ) {
    deleteLap(input: $input, condition: $condition) {
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
export const createBet = /* GraphQL */ `
  mutation CreateBet(
    $input: CreateBetInput!
    $condition: ModelBetConditionInput
  ) {
    createBet(input: $input, condition: $condition) {
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
export const updateBet = /* GraphQL */ `
  mutation UpdateBet(
    $input: UpdateBetInput!
    $condition: ModelBetConditionInput
  ) {
    updateBet(input: $input, condition: $condition) {
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
export const deleteBet = /* GraphQL */ `
  mutation DeleteBet(
    $input: DeleteBetInput!
    $condition: ModelBetConditionInput
  ) {
    deleteBet(input: $input, condition: $condition) {
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
export const createRace = /* GraphQL */ `
  mutation CreateRace(
    $input: CreateRaceInput!
    $condition: ModelRaceConditionInput
  ) {
    createRace(input: $input, condition: $condition) {
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
export const updateRace = /* GraphQL */ `
  mutation UpdateRace(
    $input: UpdateRaceInput!
    $condition: ModelRaceConditionInput
  ) {
    updateRace(input: $input, condition: $condition) {
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
export const deleteRace = /* GraphQL */ `
  mutation DeleteRace(
    $input: DeleteRaceInput!
    $condition: ModelRaceConditionInput
  ) {
    deleteRace(input: $input, condition: $condition) {
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
export const createLiveChat = /* GraphQL */ `
  mutation CreateLiveChat(
    $input: CreateLiveChatInput!
    $condition: ModelLiveChatConditionInput
  ) {
    createLiveChat(input: $input, condition: $condition) {
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
export const updateLiveChat = /* GraphQL */ `
  mutation UpdateLiveChat(
    $input: UpdateLiveChatInput!
    $condition: ModelLiveChatConditionInput
  ) {
    updateLiveChat(input: $input, condition: $condition) {
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
export const deleteLiveChat = /* GraphQL */ `
  mutation DeleteLiveChat(
    $input: DeleteLiveChatInput!
    $condition: ModelLiveChatConditionInput
  ) {
    deleteLiveChat(input: $input, condition: $condition) {
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
