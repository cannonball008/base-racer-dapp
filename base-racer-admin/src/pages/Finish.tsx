import { Avatar, Button, Select, SelectItem } from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContestantsResponse, RacesResponse } from '../abi'
import { useEffect, useRef, useState } from 'react'
import { getContestants, getContract } from '../abi-src'
import { useAwaitedClickAction } from '@zardoy/react-util'
import { makeRequest } from '../fetcher'
import { gql } from 'graphql-request'
import { proxy, useSnapshot } from 'valtio'

type RaceResponse = {
    race: {
        id: string
        name: string
        currentLap: number
        laps: number
        contestants: {
            id: string
            name: string
            pic: string
        }[]
    }
}

const initialValues = {
    lapFirstWinner: '',
    lapSecondWinner: '',
    lapThirdWinner: '',
}

const formValues = proxy({
    ...initialValues,
})

export default () => {
    const raceId = useParams().raceId!
    const [race, setRace] = useState<RaceResponse['race'] | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        Object.assign(formValues, initialValues)
        const fetchContestants = async () => {
            const race = await makeRequest<RaceResponse>({
                document: gql`
                    query A1($id: String!) {
                        race(id: $id) {
                            id
                            name
                            currentLap
                            laps
                            contestants {
                                id
                                name
                                pic
                            }
                        }
                    }
                `,
                variables: {
                    id: raceId,
                },
            })
            setRace(race.race)
        }
        fetchContestants()
    }, [])

    const finishLap = useAwaitedClickAction(async () => {
        const contract = await getContract()
        const race = await contract.races(raceId)
        await contract.setLapResult(raceId, race.currentLap, formValues.lapFirstWinner, formValues.lapSecondWinner, formValues.lapThirdWinner)
        navigate('/')
    })

    if (!race) return <div>Loading...</div>
    const invalidLap = race.currentLap > race.laps

    return (
        <div className="flex flex-col gap-3">
            <p>
                <b>Finish Lap</b>
            </p>
            {!invalidLap ? (
                <form
                    className="contents"
                    onSubmit={e => {
                        e.preventDefault()
                        if (finishLap.disabled) return
                        finishLap.onClick(undefined)
                    }}
                >
                    <Contestants contestants={race.contestants} label="First Winner" propKey={'lapFirstWinner'} />
                    <Contestants contestants={race.contestants} label="Second Winner" propKey={'lapSecondWinner'} />
                    <Contestants contestants={race.contestants} label="Third Winner" propKey={'lapThirdWinner'} />
                    <Button disabled={finishLap.disabled} type="submit" isLoading={finishLap.disabled}>
                        Finish Lap
                    </Button>
                </form>
            ) : (
                'Finishing the last lap. Can only finish the race. You need to check the dashboard now'
            )}
        </div>
    )
}

function Contestants({ contestants: _contestants, label, propKey }) {
    const formValuesCur = useSnapshot(formValues)
    // filter the contestants that are selected in other keys
    const keys = Object.keys(formValuesCur)
    const contestants = _contestants.filter(x => !keys.filter(k => k !== propKey).some(k => formValuesCur[k] === x.id))
    const values = [...contestants.map(x => ({ value: Number(x.id), label: x.name, picture: x.pic })), { value: '0', label: '<No winner>', picture: '' }]

    return (
        <Select
            label={label}
            defaultSelectedKeys={[]}
            onSelectionChange={keys => {
                formValues[propKey] = [...keys][0]
            }}
            isRequired
        >
            {values.map(({ value, label, picture }) => (
                <SelectItem key={value} value={value} textValue={label}>
                    <div className="flex gap-2 items-center">
                        <Avatar src={picture} name={label} size="sm" />
                        {label}
                    </div>
                </SelectItem>
            ))}
        </Select>
    )
}
