/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateContestant = /* GraphQL */ `
  subscription OnCreateContestant(
    $filter: ModelSubscriptionContestantFilterInput
  ) {
    onCreateContestant(filter: $filter) {
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
export const onUpdateContestant = /* GraphQL */ `
  subscription OnUpdateContestant(
    $filter: ModelSubscriptionContestantFilterInput
  ) {
    onUpdateContestant(filter: $filter) {
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
export const onDeleteContestant = /* GraphQL */ `
  subscription OnDeleteContestant(
    $filter: ModelSubscriptionContestantFilterInput
  ) {
    onDeleteContestant(filter: $filter) {
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
export const onCreateBettor = /* GraphQL */ `
  subscription OnCreateBettor($filter: ModelSubscriptionBettorFilterInput) {
    onCreateBettor(filter: $filter) {
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
export const onUpdateBettor = /* GraphQL */ `
  subscription OnUpdateBettor($filter: ModelSubscriptionBettorFilterInput) {
    onUpdateBettor(filter: $filter) {
      id
      balance
      username

    }
  }
`;
export const onDeleteBettor = /* GraphQL */ `
  subscription OnDeleteBettor($filter: ModelSubscriptionBettorFilterInput) {
    onDeleteBettor(filter: $filter) {
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
export const onCreateBet = /* GraphQL */ `
  subscription OnCreateBet($filter: ModelSubscriptionBetFilterInput) {
    onCreateBet(filter: $filter) {
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
export const onUpdateBet = /* GraphQL */ `
  subscription BetUpdate {
  onUpdateBet(filter:{raceId:{eq:"7abcc0bb-1223-4bd4-b2e4-82214db3e107"}}) {
    id
    bettor
    amount
  }
}

`;
export const onDeleteBet = /* GraphQL */ `
  subscription OnDeleteBet($filter: ModelSubscriptionBetFilterInput) {
    onDeleteBet(filter: $filter) {
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
export const onCreateRace = /* GraphQL */ `
  subscription OnCreateRace($filter: ModelSubscriptionRaceFilterInput) {
    onCreateRace(filter: $filter) {
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
export const onUpdateRace = /* GraphQL */ `
  subscription OnUpdateRace($filter: ModelSubscriptionRaceFilterInput) {
    onUpdateRace(filter: $filter) {
      id
      bets {
        nextToken
        __typename
      }
      name

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
export const onDeleteRace = /* GraphQL */ `
  subscription OnDeleteRace($filter: ModelSubscriptionRaceFilterInput) {
    onDeleteRace(filter: $filter) {
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
export const onCreateLiveChat = /* GraphQL */ `
  subscription OnCreateLiveChat($filter: ModelSubscriptionLiveChatFilterInput) {
    onCreateLiveChat(filter: $filter) {
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
export const onUpdateLiveChat = /* GraphQL */ `
  subscription OnUpdateLiveChat($filter: ModelSubscriptionLiveChatFilterInput) {
    onUpdateLiveChat(filter: $filter) {
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
export const onDeleteLiveChat = /* GraphQL */ `
  subscription OnDeleteLiveChat($filter: ModelSubscriptionLiveChatFilterInput) {
    onDeleteLiveChat(filter: $filter) {
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
