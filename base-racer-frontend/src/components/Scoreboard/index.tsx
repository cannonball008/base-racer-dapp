import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { useFetch } from "../../fetcher"
import { gql } from "graphql-request"
import { contractState } from '../../pages/contract';
import { useSnapshot } from 'valtio';

const index = () => {
  const { contract } = useSnapshot(contractState)

  const [scoreboardUpdate, setScoreboardUpdate] = useState(0)

  type Type = {
    activeScoreboard: {
      contestant: {
        id: string
        name: string
        pic: string
      }
      overallScore: number
      lapScore: number[]
    }[]
  }

  const { data } = useFetch<Type>({
    document: gql`
      query A {
        activeScoreboard {
          contestant {
            id
            name
            pic
          }
          overallScore
          lapScore
        }
      }
    `,
    stateCounter: scoreboardUpdate,
  })
  const maxLaps = data?.activeScoreboard.reduce((acc, item) => Math.max(acc, item.lapScore.length), 0) ?? 0
  // const allPlayers = data?.activeScoreboard.map(item => item.contestant)

  useEffect(() => {
    if (!contract) return
    contract.on('LapFinished', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('RaceFinished', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('RaceStarted', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('RaceDeleted', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('ContestantUpdated', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('RaceCreatedWithContestants', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('RaceCreated', () => {
      setScoreboardUpdate(value => value + 1)
    })
    contract.on('ContestantRaceStatusChangedBatch', () => {
      setScoreboardUpdate(value => value + 1)
    })
  }, [contract])

  return (
    <section className="wrap" style={{ margin: 'auto' }}>
      <TableContainer>
        <Table colorScheme="twitter">
          <Thead>
            <Tr>
              <Th>Players</Th>
              {Array.from({ length: maxLaps }).map((x, i) => {
                return <Th textAlign={'center'}>Lap {i+1}</Th>
              })}
              <Th textAlign={'center'}>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.activeScoreboard.map(score => {
              return <Tr key={score.contestant.id}>
                <Td>{score.contestant.name}</Td>
                {score.lapScore.map((score, i) => {
                  return <Td textAlign={'center'} key={score+'-'+i}>{score}</Td>
                })}
                <Td textAlign={'center'}>{score.overallScore}</Td>
              </Tr>
          })}
          </Tbody>

        </Table>
      </TableContainer>
    </section>
  );
};

export default index;
