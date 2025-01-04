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
import { RaceBetMapped, RaceType } from '../../pages/Betting/Betting';
import DcrAmount from '../../DcrAmount';

export default ({ bets: _bets, race: _race }) => {
  const allBets = _bets as RaceBetMapped[]
  const race = _race as RaceType | undefined
  const raceBets = allBets.filter(bet => bet.race.id === race?.activeRace?.id)
  const betsPerPlayer = allBets.reduce((acc, bet) => {
    acc[bet.contestantId] ??= []
    acc[bet.contestantId].push(bet)
    return acc
  }, {} as Record<string, RaceBetMapped[]>)
  const { contract } = useSnapshot(contractState)

  const maxLaps = race?.activeRace?.laps ?? 0
  const allPlayers = race?.activeRace?.contestants ?? []

  return (
    <section className="wrap" style={{ margin: 'auto' }}>
      <TableContainer>
        <Table colorScheme="twitter">
          <Thead>
            <Tr>
              <Th>Contestants</Th>
              {Array.from({ length: maxLaps }).map((x, i) => {
                return <Th textAlign={'center'}>Lap {i + 1}</Th>
              })}
              <Th textAlign={'center'}>Full Race</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allPlayers.map(player => {
              const sumBetsRace = raceBets.filter(bet => bet.contestantId === player.id && bet.betType === 'RACE').reduce((acc, bet) => acc + bet.amount, 0)
              let sumOfLaps = 0
              return <Tr key={player.id}>
                <Td>{player.name}</Td>
                {Array.from({ length: maxLaps }).map((_, lap) => {
                  const betsSum = raceBets.filter(bet => bet.contestantId === player.id && bet.lap === lap + 1).reduce((acc, bet) => acc + bet.amount, 0)
                  sumOfLaps += betsSum
                  return <Td textAlign={'center'} key={betsSum + '-' + lap}><DcrAmount dcr={betsSum} /></Td>
                })}
                <Td textAlign={'center'}><DcrAmount dcr={sumBetsRace} /></Td>
              </Tr>
            })}
            <Tr>
              <Td>Total</Td>
              {Array.from({ length: maxLaps }).map((_, lap) => {
                const betsSum = raceBets.filter(bet => bet.lap === lap + 1).reduce((acc, bet) => acc + bet.amount, 0)
                return <Td textAlign={'center'} key={betsSum + '-' + lap}><DcrAmount dcr={betsSum} /></Td>
              })}
              <Td textAlign={'center'}><DcrAmount dcr={raceBets.filter(bet => bet.betType === 'RACE').reduce((acc, bet) => acc + bet.amount, 0)} /></Td>
            </Tr>
          </Tbody>

        </Table>
      </TableContainer>
    </section>
  );
};
