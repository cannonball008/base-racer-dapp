import { useEffect, useState } from "react";
import { raceByStatusAndStartTime } from "./../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

const useFetchRace = (fetchData, setFetchData) => {
    const [race, setRace] = useState(null);
    const currentdate = new Date();
    const year = currentdate.getFullYear();
    const month = parseInt(currentdate.getMonth())+1;
    const day = currentdate.getDate();
    const nextDay = currentdate.getDate()+1;
    const date = year+'-'+((month < 10) ? '0'+month : month) +'-'+((parseInt(day) < 10 ? '0'+day : day));
    
    const nextdate = year+'-'+((month < 10) ? '0'+month : month) +'-'+((parseInt(nextDay) < 10 ? '0'+nextDay : nextDay));

    const loadRace = async () => {
        const races = await API.graphql({
            query: raceByStatusAndStartTime, 
            variables: {
                status: "SCHEDULED", 
                startTime: {between: [new Date().toISOString(),new Date(nextdate).toISOString()]},
                sortDirection: 'ASC'
            },
            authMode: "API_KEY"
        })

        setRace(races);
    }

    useEffect(() => {
        if(fetchData) {
            loadRace()
        }
    }, [fetchData])

    return race
    
}

export default useFetchRace