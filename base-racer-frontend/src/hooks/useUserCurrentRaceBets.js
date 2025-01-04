import { useEffect, useState } from "react";
import { betsByBettor } from "./../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { useContext } from 'react'
import { GlobalContext } from './../context/UserContext'

const useUserCurrentRaceBets = (fetchData, setFetchData, raceId) => {
    const [bets, setBets] = useState(null);
    const [user, setUser] = useContext(GlobalContext);

    const loadBets = async (raceId) => {
        if(user && raceId) {
            const betss = await API.graphql({
                query: betsByBettor, 
                variables: {
                    bettor: user.attributes.sub, 
                    filter: {raceId: {eq: raceId} }
                },
                authMode: "API_KEY"
            })
    
            setBets(betss);
        }
    }

    useEffect(() => {
        if(fetchData) {
            loadBets(raceId)
        }
    }, [fetchData])

    return bets

}

export default useUserCurrentRaceBets