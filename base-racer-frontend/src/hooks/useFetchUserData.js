import { useEffect, useState } from "react";
import { getBettor } from "./../graphql/queries";
import { API } from "aws-amplify";


const useFetchUserData = (fetchData, setFetchData, user) => {
    const [userdata, setUserdata] = useState(null)

    const getUserdata = async (id) => {
        const data = await API.graphql({
            query: getBettor, 
            authMode: 'API_KEY', 
            variables: {
                id
            }
        })

        setUserdata(data);
        setFetchData(false)
    }

    useEffect(() => {
        if(fetchData && user) {
            getUserdata(user.attributes.sub)
        }
    }, [fetchData, user])

    return userdata
    
}

export default useFetchUserData