import { useState } from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Spinner, useToast } from '@chakra-ui/react'
import { useUser } from '../../utils/user'
import { waitForEvent } from '../../pages/contract'
import { makeBet } from './placeBet'
import { RaceType } from '../../pages/Betting/Betting'
import { useWalletClient } from 'wagmi'
import useChainId from '../../hooks/useChainId'

export const getCanBetRace = (race: RaceType) => race.activeRace?.betStatus === 'OPEN'
export const getCanBetLap = (race: RaceType) => race.activeRace && race.activeRace?.currentLap < race.activeRace!.laps

const RaceLapBet = ({ onClose, player, race_id, _race, betType }) => {
  const race = _race as RaceType
  const laps = Array.from({ length: race.activeRace?.laps ?? 0 }, (_, i) => i + 1).filter(i => i > race.activeRace!.currentLap)

  const user = useUser()
  const [amount, setAmount] = useState('')
  // const [betType, setBetType] = useState('')
  const [position, setPosition] = useState('')
  const [isLoading, setLoading] = useState(false)
  const regexp = /^\d+(\.\d{1,18})?$/

  const toast = useToast()

  const handleAmountChange = (e) => setAmount(e.target.value)
  // const handleLapChange = (e) => setBetType(e.target.value)
  const handlePositionChange = (e) => setPosition(e.target.value)

  const handleClose = () => {
    setAmount('')
    // setBetType('')
    setPosition('')
    onClose()
  }

  const { minBet = 0, maxBet = Infinity } = race.activeRace!

  const isBetInRange = parseFloat(amount) >= minBet && parseFloat(amount) <= maxBet

  const isErrorAmount = amount === '' || !regexp.test(amount)
  const isErrorLap = betType === ''
  const isErrorPosition = position === ''
  const { chainId } = useChainId()
  const { data: client } = useWalletClient({ chainId: chainId ?? undefined })

  const betLap = race.activeRace!.currentLap + 1
  const placeBet = async () => {
    if (!isErrorAmount && !isErrorLap && isBetInRange && client) {
      if (user) {
        try {

          setLoading(true)

          await makeBet(race_id, player.id, amount, betType === 'lap' ? betLap : null, client)
          // await waitForEvent('BetCreated', {
          //   bet: {
          //     bettor: client.account.address
          //   }
          // })
          setLoading(false)
          onClose()
          toast({
            title: betType === 'lap' ? "Bet on Lap" : 'Bet on Race',
            description: `Bet on ${betType} placed successfully`,
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        } finally {
          setLoading(false)
        }
      }
    }

  }

  // const selectRef = useRef<HTMLSelectElement>(null!)
  // useEffect(() => {
  //   const allDisabled = selectRef.current.querySelectorAll('option:disabled')
  //   const allOptions = selectRef.current.querySelectorAll('option')
  //   if (allDisabled.length === allOptions.length) return
  //   selectRef.current.dispatchEvent(new Event('change', {
  //     bubbles: true,
  //   }))
  // }, [])

  const canBetRace = getCanBetRace(race)
  const canBetLap = getCanBetLap(race)
  return (
    <>
      <Box mt={8}>
        {/* <FormControl isInvalid={isErrorLap || !isBetInRange} mb={3}> */}
        {/* <FormLabel>Select Lap</FormLabel> */}
        {/* <Select value={betType} onChange={handleLapChange} ref={selectRef}>
            <option value="race" disabled={!canBetRace}>Bet on Full Race</option>
            {canBetLap && <option value="lap" disabled={!canBetLap}>Bet on Lap {betLap}</option>}
            {/* <option value="">Select Lap</option>
            // {
            //   // laps && laps.length > 0 && laps.map((item, i) => {
            //     // if (parseInt(race.currentLap) === parseInt(item.lapNumber)) {
            //     //   return <option key={i} value={item.id}>Lap {item.lapNumber}</option>
            //     // }
            //   // })
            //   // todo check if open
            //   laps.map((item, i) => {
            //     return <option key={item} value={item}>Lap {item}</option>
            //   })
            // }}
          </Select> */}
        {/* </FormControl> */}

        {/* <FormControl isInvalid={isErrorPosition} mb={3}>
            <FormLabel>Select Position</FormLabel>
            <Select value={position} onChange={handlePositionChange}>
              <option value="">Select Position</option>
              <option value="FIRST">First</option>
              <option value="SECOND">Second</option>
              <option value="THIRD">Third</option>
              <option value="FOURTH">Fourth</option>
            </Select>
            {!isErrorPosition ? (
                <FormHelperText>
                    Select the Position of the player you want to bet on.
                </FormHelperText>
            ) : (
                <FormErrorMessage>Position is required.</FormErrorMessage>
            )}
          </FormControl> */}

        <FormControl isInvalid={isErrorAmount || !isBetInRange}>
          <FormLabel>Amount DCR to Bet</FormLabel>
          <Input type='text' value={amount} onChange={handleAmountChange} />
          {!isBetInRange ?
            <FormErrorMessage>Amount must be between {minBet} and {maxBet}</FormErrorMessage> :
            !isErrorAmount ? (
              <FormHelperText>
                Enter the amount you'd like to bet.
              </FormHelperText>
            ) : (
              (
                <FormErrorMessage>Bet type is required.</FormErrorMessage>
              )
            )}
        </FormControl>
        <Box mt={3} float={'right'}>
          <Button disabled={isLoading} variant={'outline'} colorScheme='red' mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} colorScheme='blue' mr={3} onClick={placeBet}>
            {
              isLoading && (
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='md'
                />
              )
            }
            {
              !isLoading && 'Place Bet'
            }
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default RaceLapBet
