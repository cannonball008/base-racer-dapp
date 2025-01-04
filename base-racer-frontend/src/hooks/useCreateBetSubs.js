import { API, graphqlOperation } from "aws-amplify";
import { onCreateBet, onUpdateRace, onUpdateBettor, onUpdateBet } from "../graphql/subscriptions";

export const useCreateBetSubs = (setFetchData) => {
    const sub = API.graphql(
        {
          query: onCreateBet,
          authMode: 'API_KEY'
        }
      ).subscribe({
        next: ({ provider, value }) => {
          setFetchData(true)
        },
        error: (error) => console.warn(error),
    });

    return sub
}

export const useUpdateBetSubs = (setFetchData) => {
    const sub = API.graphql(
        {
          query: onUpdateBet,
          authMode: 'API_KEY',
        variables: {
          filter: {

            }
          },
        }
      ).subscribe({
        next: ({ provider, value }) => {
          console.log('value', value)
          // setFetchData(true)
        },
        error: (error) => {
          return console.warn('impo', error);
        },
    });

    return sub
}


export const useUpdateRaceSubs = (setFetchData) => {
  const sub = API.graphql(
      {
        query: onUpdateRace,
        authMode: 'API_KEY'
      }
    ).subscribe({
      next: ({ provider, value }) => {
        setFetchData(true)
      },
      error: (error) => console.warn(error),
  });

  return sub
}

export const useUpdateUserData = (setFetchData) => {
  const sub = API.graphql(
      {
        query: onUpdateBettor,
        authMode: 'API_KEY'
      }
    ).subscribe({
      next: ({ provider, value }) => {
        setFetchData(true)
      },
      error: (error) => console.warn(error),
  });

  return sub
}
