import {
  Table,
  Thead,
  Tbody, Tr,
  Th,
  Td, TableContainer,
  Avatar,
  Button,
  useToast,
  Spinner
} from "@chakra-ui/react"

import { useEffect, useState } from "react"

import { contractState, waitForEvent } from "../../pages/contract"
import { RaceBetMapped } from '../../pages/Betting/Betting'
import DcrAmount from '../../DcrAmount'
import { getPublicClient } from '@wagmi/core'
import { waitForTransactionReceipt } from 'viem/actions'
import {useClient, useWalletClient} from 'wagmi'

const index = ({ bets }: { bets: RaceBetMapped[] }) => {
  const [isLoading, setLoading] = useState(false)
  const toast = useToast()
  const { data: client } = useWalletClient()

  const claimReward = async (bet: RaceBetMapped) => {
    try {
      if (!contractState.contract) throw new Error("Check your wallet connection")
      setLoading(true)
      // const publicClient = getPublicClient()
      const tx = await (bet.lap ? contractState.contract.write.claimLapResult([bet.race.id, bet.lap, bet.contestantId]) : contractState.contract.write.claimRaceResult([bet.race.id])) as `0x${string}`
      await Promise.all([
        waitForTransactionReceipt(client as any, {
          hash: tx,
        }),
        // waitForEvent(bet.lap ? 'LapRewardClaimed' : 'RaceRewardClaimed', {}) // todo
      ])
      toast({
        title: "Reward Claim",
        description: "Reward claimed successfully and the amount is added to your account balance",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {
        isLoading && (
          <div style={{ position: "fixed", top: '0px', left: '0px', zIndex: '999', width: "100vw", height: '100vh', background: "rgba(0,0,0,0.8)" }}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(50%, 50%)' }}>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='lg'
              />
            </div>
          </div>
        )
      }
      <section className="wrap" style={{ margin: 'auto' }}>
        <TableContainer >
          <Table colorScheme="twitter">
            <Thead>
              <Tr>
                <Th textAlign={"center"}>Bet Status</Th>
                <Th textAlign={"center"}>PnL</Th>
                <Th textAlign={"center"}>Bet Amount</Th>
                <Th textAlign={"center"}>Player</Th>
                <Th textAlign={"center"}>Bet Type</Th>
                <Th textAlign={"center"}>Race Name</Th>
                <Th textAlign={"center"}>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                bets && bets.length > 0 && bets.map((bet, i) => {
                  const winAmount = (bet.result === 'WIN' ? bet.winAmount : 0) ?? -0.01
                  const pnlDiff = winAmount - bet.amount
                  return <Tr key={i}>
                    <Td textAlign={"center"}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', }}>
                        <div>
                          {bet.claimed ? 'CLAIMED' : bet.result === 'WIN' ? "WON" : bet.result === 'LOSE' ? "LOST" : bet.result === 'WAITING' ? 'Waiting' : bet.result}{' '}
                          {/* amount if won */}
                          {bet.result === 'WIN' && <span><DcrAmount dcr={winAmount} /></span>}
                        </div>
                        {
                          bet.result === 'WIN' && !bet.claimed && (
                            <Button disabled={isLoading} bg={"brand.100"} onClick={() => claimReward(bet)}>
                              Claim
                            </Button>
                          )
                        }
                      </div>
                    </Td>
                    <Td textAlign={"center"}><DcrAmount dcr={pnlDiff} /></Td>
                    <Td textAlign={"center"}><DcrAmount dcr={bet.amount} /></Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar size='md' name={bet.contestantImage} src={`${bet.contestantImage}`} />
                        <span style={{ marginLeft: '10px' }}>{bet.contestantName}</span>
                      </div>
                    </Td>
                    <Td textAlign={"center"}>{bet.betType === 'LAP' ? `Lap ${bet.lap}` : 'Full Race'}</Td>
                    <Td>{bet.race.name}</Td>
                    <Td textAlign={"center"}>{new Date(bet.createdAt).toISOString().split("T")[0]}</Td>
                  </Tr>
                })
              }


            </Tbody>

          </Table>
        </TableContainer>
      </section>
    </>
  )
}

export default index
