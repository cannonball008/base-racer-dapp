import "./style.scss"
import { Avatar, Box, Button, useDisclosure } from "@chakra-ui/react"
import CreateBetModal from '../CreateBetModal'
import { useState } from "react"
import { getCanBetLap, getCanBetRace } from "../CreateBetModal/RaceLapBet"
import { RaceBetMapped } from '../../pages/Betting/Betting'
import { useAccount } from 'wagmi'
import DcrAmount from '../../DcrAmount'

const BettingCard = ({ players, race, bets: _bets, disabled }) => {
  const bets = _bets as RaceBetMapped[]
  // const { isOpen:lapIsOpen , onOpen:lapOnOpen , onClose:lapOnClose  } = useDisclosure()
  // const { isOpen:raceIsOpen , onOpen:raceOnOpen , onClose:raceOnClose  } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [betType, setBetType] = useState('lap')
  const [splayer, setSplayer] = useState(null as {
    id: string
  } | null)

  const { address } = useAccount()


  // $(".card-right__fav").on("click", function () {
  //   $(this).parent().find(".star").toggleClass("fav");
  // });

  // $(".odds-1").on("click", function () {
  //   $(this).parent().find(".odds-1").toggleClass("clicked");
  // });

  // $(".odds-x").on("click", function () {
  //   $(this).parent().find(".odds-x").toggleClass("clicked");
  // });

  // $(".odds-2").on("click", function () {
  //   $(this).parent().find(".odds-2").toggleClass("clicked");
  // });
  if (players.length === 0) {
    // players = [{
    //   contestantDetail: {
    //     image: '1.png',
    //     name: 'Test Player 1'
    //   }
    // }]
  }

  return (
    <>
      <section style={{ margin: 'auto', width: '100%' }}>
        {
          players.length > 0 && players.map((contestant, i) => {
            const lastLap = race?.activeRace?.currentLap === race?.activeRace?.laps
            const searchLap = lastLap ? race.activeRace?.currentLap : race.activeRace?.currentLap + 1
            const lapBet = bets.find(bet => bet.result !== 'REMOVED' && bet.betType === 'LAP' && bet.contestantId === contestant?.id && bet.race.id === race?.id && bet.bettor.toLowerCase() === address?.toLowerCase() && bet.lap === searchLap)
            const betLapDisabled = disabled || !getCanBetLap(race) || lapBet
            const raceBet = bets.find(bet => bet.result !== 'REMOVED' && bet.betType === 'RACE' && bet.contestantId === contestant?.id && bet.race.id === race?.id && bet.bettor.toLowerCase() === address?.toLowerCase())
            const anyRaceBet = bets.find(bet => bet.result !== 'REMOVED' && bet.betType === 'RACE' && bet.race.id === race?.id && bet.bettor.toLowerCase() === address?.toLowerCase())
            const betRaceDisabled = disabled || !getCanBetRace(race) || raceBet || anyRaceBet
            return <Box key={contestant.id} style={{
              margin: '2px 0',
              background: 'rgba(255, 255, 255, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '10px 20px',
              overflow: 'auto',
            }} flexDirection={{
              base: 'column',
              md: 'row',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar size='md' name={contestant.contestantDetail?.image} src={`${contestant.contestantDetail?.image}`} />
                <a>{contestant.contestantDetail?.name}</a>
              </div>


              <Box style={{ height: '100%', display: "flex", alignItems: "center", gap: 5 }} flexDirection={{
                base: 'column',
                md: 'row',
              }}>
                {!betRaceDisabled && <div style={{ fontSize: 20, }} onClick={() => {
                  if (betRaceDisabled) return
                  setBetType('race')
                  setSplayer(contestant)
                  onOpen()
                }}>
                  <Button colorScheme='blue' mr={3} disabled={betRaceDisabled} opacity={betRaceDisabled ? 0.5 : 1}>Bet on Race</Button>
                </div>}
                {raceBet && <BetDisplay raceBet={raceBet} />}
                {!betLapDisabled && <div style={{ fontSize: 20, paddingRight: 0, }} onClick={() => {
                  if (betLapDisabled) return
                  setBetType('lap')
                  setSplayer(contestant)
                  onOpen()
                }}>
                  <Button colorScheme='blue' mr={3} disabled={betLapDisabled} opacity={betLapDisabled ? 0.5 : 1}>Bet on Lap {(race?.activeRace?.currentLap ?? 0) + 1}</Button>
                </div>}
                {lapBet && <BetDisplay raceBet={lapBet} />}
                {/* <Menu>
                  <MenuButton>
                    <div className="card-right__markets">
                      <strong>Bet</strong>
                      <i>
                        <svg viewBox="0 0 16 16">
                          <g>
                            <polygon points="9.3,1.3 7.9,2.7 12.2,7 0,7 0,9 12.2,9 7.9,13.3 9.3,14.7 16,8 "></polygon>
                          </g>
                        </svg>
                      </i>
                    </div>
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title={item.contestantDetail?.name}>
                    <MenuDivider />
                      <MenuItem as='button' onClick={() => {
                        setSplayer(item)
                        lapOnOpen()
                      }}>Bet on a Lap</MenuItem>
                      <MenuItem as='button' onClick={() => {
                        setSplayer(item)
                        raceOnOpen()
                      }}>Bet on Race</MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu> */}
              </Box>

            </Box>
          })
        }

      </section>
      {/* <BatLapModal isOpen={lapIsOpen}  onOpen={lapOnOpen}  onClose={lapOnClose} player={splayer} race_id={race?.id} laps={laps}></BatLapModal>
      <BatRaceModal isOpen={raceIsOpen}  onOpen={raceOnOpen}  onClose={raceOnClose} player={splayer} race_id={race?.id} ></BatRaceModal> */}
      <CreateBetModal betType={betType} race_obj={race} isOpen={isOpen} onOpen={onOpen} onClose={onClose} player={splayer} race_id={race?.id} />
    </>
  )
}

export default BettingCard

function BetDisplay({ raceBet }: {
  raceBet: RaceBetMapped
}) {
  return <div style={{
    fontSize: 20,
    width: 120,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  }} className="card-right__markets">
    <small style={{
      fontSize: '11px',
    }}>Race Bet</small>
    <DcrAmount dcr={raceBet.amount} />
  </div>
}
