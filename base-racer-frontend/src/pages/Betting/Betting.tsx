import {
  Box, Heading, ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  chakra,
  useDisclosure,
  useToast
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Header from "../../components/Header/Header"
import SecondFooter from "../../components/SecondFooter/SecondFooter"
import "./style.css"
import LiveNowSingle from "../../components/TwitchLiveStream/TwitchLiveStream"
import AnimatedHeadings from "../../components/AnimatedHeading/AnimatedHeading"
import BettingCard from "../../components/BettingCard/BettingCard"
import AnimatedBtn from "../../components/AnimatedButton/AnimatedBtn"
import PreviousPlayerModal from "../../components/PreviousPlayersModal/PreviousPlayerModal"

import UserBalance from '../../components/UserBalance'

import Scoreboard from '../../components/Scoreboard'
import BettingHistory from '../../components/BettingHistory'
import { useFetch } from "../../fetcher"
import { gql } from 'graphql-request'
import { useAccount, useBalance } from 'wagmi'
import { contractState } from '../contract'
import { useSnapshot } from 'valtio'
import { getCanBetLap, getCanBetRace } from '../../components/CreateBetModal/RaceLapBet'
import useChainId from '../../hooks/useChainId'
import RaceBets from '../../components/Scoreboard/RaceBets'
import DcrAmount from '../../DcrAmount'

export type RaceType = {
  activeRace?: {
    id: string
    name: string
    startingAt: string
    currentLap: number // todo update
    laps: number
    status: 'SCHEDULED' | 'ONGOING' | 'FINISHED' | 'CANCELLED'
    betStatus: "OPEN" | "CLOSED"
    minBet: number
    maxBet: number
    contestants: {
      id: string
      name: string
      pic: string
    }[]
  }
}

export type RaceBets = {
  id: string
  result: 'WIN' | 'LOSE' | 'WAITING' | "REMOVED"
  winAmount: number
  bettor: string
  amount: number
  contestantId: string
  lap: number
  createdAt: string
  claimed: boolean
  betType: "RACE" | "LAP"
  tx?: string
  race: {
    id: string
    name: string
  }
}

export type RaceBetMapped = RaceBets & {
  contestantName: string
  contestantImage: string
  betterDetail: {
    username: string
  }
}

const Betting = () => {
  const toast = useToast()
  const { isConnected } = useAccount()
  const connected = isConnected
  const { etherscan } = useChainId()

  const [raceUpdateCounter, setRaceUpdateCounter] = useState(0)
  const updateRaceUpdateCounter = () => {
    setTimeout(() => {
      setRaceUpdateCounter(n => n + 1)
    }, 700)
  }

  const document = gql`
  query ActiveRace {
      activeRace {
          id
          name
          startingAt
          betStatus
          currentLap
          laps
          status
          minBet
          maxBet
          contestants {
              id
              name
              pic
          }
      }
  }
  `

  const { data: race, loading } = useFetch<RaceType>({
    document,
    stateCounter: raceUpdateCounter,
  })
  if (race) {
    ; (race as any).id = race.activeRace?.id
  }
  const activeRace = race?.activeRace
  const localizedTimeStarting = activeRace && new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(activeRace.startingAt))

  const { address } = useAccount()
  const balance = useBalance({ address })

  const [laps, setLaps] = useState(null)
  const [userCurrentBets, setUserCurrentBets] = useState(null)

  const [fetchRace, setFetchRace] = useState(true)
  const [fetchUserBets, SetfetchUserBets] = useState(false)

  // Data Fetch Hooks
  // const races = useFetchRace(fetchData, setFetchData);
  // const bets = useUserCurrentRaceBets(fetchData, setFetchData, race?.id);
  // const fetchUser = useFetchUserData(fetchData, setFetchData, user)

  // subscriptions
  // const createBetSubscription = useCreateBetSubs(setFetchData)
  // const updateRaceSubscription = useUpdateRaceSubs(setFetchData)
  // const updateUserSubscription = useUpdateUserData(setFetchData)
  // updateBetSubs is observable subscription



  const pageSize = 20
  const [page, setPage] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    console.log('race', race)
  }, [race])

  const players = activeRace?.contestants.map(contestant => ({
    id: contestant.id,
    contestantDetail: {
      id: contestant.id,
      name: contestant.name,
      image: contestant.pic
    }
  }))

  type BetsFetch = {
    raceBets: RaceBets[],
  }

  const [betsCounter, setBetsCounter] = useState(0)

  const { data: betsData } = useFetch<BetsFetch>({
    document: gql`
    # todo think of optimizing this query by making it only in bets history tab
      query Bets {
        raceBets {
          id
          result
          bettor
          amount
          contestantId
          lap
          createdAt
          claimed
          betType
          tx
          winAmount
          race {
            id
            name
          }
        }
      }
    `,
    variables: {
      raceId: activeRace?.id
    },
    enabled: !!activeRace,
    stateCounter: betsCounter,
  })

  const { contract } = useSnapshot(contractState)

  useEffect(() => {
    if (!contract) return
    contract.on('LapFinished', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceCreated', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceCreatedWithContestants', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceDeleted', () => {
      updateRaceUpdateCounter()
    })
    contract.on('ContestantUpdated', () => {
      updateRaceUpdateCounter()
    })
    contract.on('ContestantRaceStatusChanged', () => {
      updateRaceUpdateCounter()
    })
    contract.on('ContestantRaceStatusChangedBatch', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceFinished', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceLapStarted', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceStarted', () => {
      updateRaceUpdateCounter()
    })
    contract.on('RaceUpdated', () => {
      updateRaceUpdateCounter()
    })
  }, [!!contract])

  useEffect(() => {
    if (!contract) return
    contract.on('BetUpdated', () => {
      setBetsCounter(n => n + 1)
    })
    contract.on('BetDeleted', (_betId, bet) => {
      const bettor = bet.bettor.toString().toLowerCase()
      const lap = Number(bet.lap)
      if (bettor === address?.toLowerCase()) {
        const amountWei = bet.amount
        const amountGwei = Number(amountWei) / 10 ** 18
        toast({
          title: "Your bet was cancelled!",
          description: `Your bet on ${lap ? `Lap ${lap}` : 'Full Race'} was cancelled. ${amountGwei} DCR was refunded to your account.`,
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      }
      setBetsCounter(n => n + 1)
    })
    contract.on('BetCreated', () => {
      setTimeout(() => {
        setBetsCounter(n => n + 1)
      }, 700)
    })
    contract.on('RaceRewardClaimed', () => {
      setBetsCounter(n => n + 1)
    })
    contract.on('LapRewardClaimed', () => {
      setBetsCounter(n => n + 1)
    })
    contract.on('LapFinished', () => {
      setTimeout(() => {
        setBetsCounter(n => n + 1)
      }, 700)
    })
    contract.on('RaceFinished', () => {
      setTimeout(() => {
        setBetsCounter(n => n + 1)
      }, 700)
    })
  }, [!!contract])

  const bets = players && [...(betsData?.raceBets ?? []).map((bet): RaceBetMapped => ({
    ...bet,
    contestantName: players.find(p => p.id === bet.contestantId)?.contestantDetail.name!,
    contestantImage: players.find(p => p.id === bet.contestantId)?.contestantDetail.image!,
    betterDetail: {
      username: bet.bettor
    }
  }))].reverse() || []

  const betsAvailable = race && (getCanBetRace(race) || getCanBetLap(race))
  const betsDisabled = !betsAvailable || !activeRace || activeRace.status === 'FINISHED' || activeRace.status === 'CANCELLED'
  return (
    <>
      <Header />
      <div className="flexTop">
        <Box w={"100%"} onClick={() => setOpen(true)}>
          <AnimatedBtn title="Current Betting"></AnimatedBtn>
        </Box>
        {/* <Box mt={"2rem"} w={"100%"} onClick={onOpen}>
          <AnimatedBtn title="Chat Live"></AnimatedBtn>
        </Box> */}
        {/* <ChatModal isOpen={isOpen} onClose={onClose} /> */}
        {open && <PreviousPlayerModal open={open} setOpen={setOpen} bets={bets.filter(bet => bet.race.id === race?.activeRace?.id)} />}
      </div>
      <div className="flex-container" style={{
        overflow: 'hidden',
      }}>
        <aside
          style={{
            height: `100%`,
            overflow: 'auto',
          }}
        >
          <UserBalance balance={(balance?.data?.formatted && (+balance.data.formatted).toFixed(4))} symbol={balance.data?.symbol}></UserBalance>

          <Heading fontSize={"1.1rem"} textAlign={"center"}>
            Current Betting
          </Heading>
          <chakra.div
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            width={"100%"}
            p={4}
            gap={"1rem"}
            sx={{
              height: "100%", // Set the height to 100% to fill the available space
              overflowY: "auto", // Enable vertical scrolling when content overflows
              overflowX: "hidden", // Disable horizontal scrolling
              "&::-webkit-scrollbar": {
                width: "0.5rem",
              },
              "&::-webkit-scrollbar-track": {
                width: "0.5rem",
                background: "#171923",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
                borderRadius: "24px",
              },
            }}
          >
            <UnorderedList fontSize={".8rem"} listStyleType={"none"} width="100%" spacing={3} mx={5}>
              {bets && bets.length > 0 && bets
                .filter(bet => bet.result !== 'REMOVED')
                .slice(page * pageSize, page * pageSize + pageSize)
                .map((item, i) => (

                  <ListItem
                    key={i}
                    bg={"#1A202C"}
                    py={2}
                    px={4}
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    alignItems={"center"}
                    cursor={"pointer"}
                    fontWeight={300}
                    _hover={{
                      color: "gray.400",
                    }}
                  >
                    <a title={item.betterDetail.username} href={item.tx ? `http://${etherscan}/tx/${item.tx}` : undefined}>{item.betterDetail.username.slice(0, 5) + '......' + item.betterDetail.username.slice(37, 42)}</a>
                    <DcrAmount dcr={item.amount} />
                  </ListItem>
                ))
              }

              {
                bets && bets.length === 0 &&
                <Text fontSize='sm' align={'center'}>No Bets Available</Text>
              }
            </UnorderedList>
          </chakra.div>
        </aside>
        <main style={{
          overflow: 'auto',
        }}>
          <div className="content">
            {/* <iframe
              src="https://www.unlonely.app/channels/diecastracer"
              className='iframe-main'
              style={{
                width: '100%',
              }}></iframe> */}
            <LiveNowSingle channelName={"diecastracer"} id={150314191} />
          </div>
          <div
            className="content"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activeRace?.status === 'SCHEDULED' && <AnimatedHeadings
              title={"Place your bets, race starts in: "} startDate={activeRace.startingAt}
            />}
            {activeRace?.status === 'ONGOING' && <AnimatedHeadings
              title={"The race is LIVE!"}
            />}
            {activeRace?.status === 'FINISHED' && <AnimatedHeadings
              title={"The last race has finished. No more races are scheduled for now."}
            />}
            {!activeRace && <AnimatedHeadings
              title={"No active race for now, check back later."}
            />}
          </div>
          <Box display={{
            base: 'block',
            lg: 'none',
          }} mt={2}>
            <UserBalance balance={(balance?.data?.formatted && (+balance.data.formatted).toFixed(4))} symbol={balance.data?.symbol} />
          </Box>
          {activeRace && <div className="content">
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              width={'100%'}
            >
              <Tabs isFitted variant='enclosed-colored' width={'100%'}>
                <TabList mb='1em'>
                  {race.activeRace?.status !== 'FINISHED' && <Tab>Place your Bets</Tab>}
                  {/* <Tab>Bet Details</Tab> */}
                  {activeRace.status !== 'SCHEDULED' && activeRace.status !== 'FINISHED' && <Tab>Scoreboard</Tab>}
                  {activeRace.status !== 'SCHEDULED' && activeRace.status !== 'FINISHED' && <Tab>Race Bets</Tab>}
                  <Tab>Betting History</Tab>
                </TabList>
                <TabPanels>
                  {race.activeRace?.status !== 'FINISHED' && <TabPanel>
                    {true && <div style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px', border: '1px solid rgb(22, 129, 191)', padding: '15px' }}>
                      <Tabs isFitted variant={'enclosed'} w={'100%'}>
                        <TabList>
                          <Tab display='flex' gap={2} flexDirection='column'>
                            <div>
                              Bet on Players {race.activeRace?.currentLap ? <small>(The current Race Lap is {race.activeRace.currentLap}/{race.activeRace.laps})</small> : null}
                            </div>
                            {race.activeRace?.currentLap === race.activeRace?.laps && 'Last Lap. Waiting for results.'}
                          </Tab>
                          {/* <Tab>Bet on Time</Tab> */}
                        </TabList>
                        <TabPanels>
                          <TabPanel>
                            <BettingCard players={players} race={race} bets={bets} disabled={betsDisabled || !isConnected} />
                          </TabPanel>
                          {/* {<TabPanel><TimeBet race={race} laps={laps}></TimeBet></TabPanel>} */}
                        </TabPanels>
                      </Tabs>
                    </div>}
                  </TabPanel>}
                  {/* <TabPanel>
                    <BetDetails bets={bets.filter(bet => bet.betterDetail.username === address)}></BetDetails>
                  </TabPanel> */}
                  {activeRace.status !== 'SCHEDULED' && activeRace.status !== 'FINISHED' &&
                    <TabPanel>
                      <Scoreboard></Scoreboard>
                    </TabPanel>
                  }
                  {activeRace.status !== 'SCHEDULED' && activeRace.status !== 'FINISHED' &&
                    <TabPanel>
                      <RaceBets bets={bets} race={race}></RaceBets>
                    </TabPanel>
                  }
                  <TabPanel>
                    <BettingHistory bets={bets.filter(bet => bet.betterDetail.username === address)} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              {/*  */}
            </Box>
          </div>}

          <SecondFooter />
        </main>
        <aside
          className="aside2"
          style={{
            width: 'auto',
            height: '100%',
          }}
        >
          <div style={{
            // grayed a bit
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            marginBottom: 3,
            marginTop: -15,
          }}>Seeing a Cookie popup? <a href={chatIframe} target='_blank' rel='noreferrer noopener'
            style={{
              // some kind of purple link
              color: '#8A2BE2',
            }}>Click Here</a>.</div>
          <TwitchChat />
        </aside>
      </div>
    </>
  )
}

const chatIframe = `https://www.twitch.tv/embed/diecastracer/chat?darkpopout&parent=${location.hostname}`
const TwitchChat = () => {
  return <iframe src={chatIframe} style={{
    height: '100%',
  }} />
}

export default Betting
