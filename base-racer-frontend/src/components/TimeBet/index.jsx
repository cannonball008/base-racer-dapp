import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody, useDisclosure,
  Button,
  Box,
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  FormErrorMessage,
  Input,
  HStack,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { useState } from 'react'
import { useUser } from '../../utils/user'


export default ({race, laps}) => {
    const user = useUser()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [type, setType] = useState('');
    const [lap, setLap] = useState('');
    const [min, setMin] = useState('');
    const [sec, setSec] = useState('');
    const [amount, setAmount] = useState('');

    const [isLoading, setLoading] = useState(false)

    const regexp = /^\d+(\.\d{1,18})?$/;

    const handleTypeChange = (e) => setType(e.target.value)
    const handleLapChange = (e) => setLap(e.target.value)
    const handleMinChange = (e) => setMin(parseInt(e.target.value) < 10 ? '0'+e.target.value : e.target.value)
    const handleSecChange = (e) => setSec(parseInt(e.target.value) < 10 ? '0'+e.target.value : e.target.value)
    const handleAmountChange = (e) => setAmount(e.target.value)

    const handleClose = () => {
      setType('')
      setLap('')
      setMin('')
      setSec('')
      setAmount('')
      onClose()
    }

    const isErrorType = type === ''
    const isErrorLap = lap === '' && type === 'LAP_TIME'
    const isErrorTime = min === '' || sec === '' || !(parseInt(min) <= 60) || !(parseInt(sec) < 60)
    const isErrorAmount = amount === '' || !regexp.test(amount)

    const placeBet = async() => {
      if(!isErrorType && !isErrorLap && !isErrorTime && !isErrorAmount) {
        if(user) {
          const data = {
            raceId: race.id,
            type: type,
            amount: amount,
            // bettor: user.attributes.sub,
            betStatus: 'UNDECLARED',
            time: `${min}:${sec}`
          }
          if(type === 'LAP_TIME') {
            data.lapId = lap
          }

          try {
            setLoading(true)

            const res = await fetch(import.meta.env.VITE_CREATE_BET_ENDPOINT, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_GATEWAY_APIKEY
                }
            })
            const resp = await res.json()
            setLoading(false)
            console.log(resp)
            onClose();
            if (resp.statusCode !== 200) {
                toast({
                    title: "Bet on Time",
                    description: JSON.parse(resp.body),
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Bet on Time",
                    description: "Bet on time placed successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
            }
          } catch(e) {
            console.error(e);
            setLoading(false)
            onClose();
          }
        }
      }
      setType('')
      setLap('')
      setMin('')
      setSec('')
      setAmount('')

    }


    return (
      <>
        <Button onClick={onOpen} colorScheme='blue' variant='outline' size={'lg'} w={'100%'}>Place Time Bets</Button>

        <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='slideInBottom' closeOnOverlayClick={false} >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Place Time Bets</ModalHeader>
            <ModalBody>
              <Box mt={8}>
                <FormControl isInvalid={isErrorType}  mb={3}>
                  <FormLabel>Select Type</FormLabel>
                  <Select value={type} onChange={handleTypeChange}>
                    <option value="">Select Type</option>
                    <option value="FULL_RACE_TIME">Race Time</option>
                    <option value="LAP_TIME">Lap Time</option>
                  </Select>
                  {!isErrorType ? (
                      <FormHelperText>
                          Select the type of bet.
                      </FormHelperText>
                  ) : (
                      <FormErrorMessage>Type is required.</FormErrorMessage>
                  )}
                </FormControl>

                {
                  type == 'LAP_TIME' && (
                    <FormControl isInvalid={isErrorLap}  mb={3}>
                      <FormLabel>Select Lap</FormLabel>
                      <Select value={lap} onChange={handleLapChange}>
                        <option value="">Select Lap</option>
                        {
                          laps && laps.length > 0 && laps.map((item, i) => (
                            <option key={i} value={item.id}>Lap {item.lapNumber}</option>
                          ))
                        }
                      </Select>
                      {!isErrorLap ? (
                          <FormHelperText>
                              Select the lap you want to bet on.
                          </FormHelperText>
                      ) : (
                          <FormErrorMessage>Lap is required.</FormErrorMessage>
                      )}
                    </FormControl>
                  )
                }

                <FormControl isInvalid={isErrorTime}   mb={3}>
                  <FormLabel>Select Time</FormLabel>
                  <HStack spacing={'10px'}>
                    <Input type='number' placeholder='min' w={'80px'} textAlign={'center'} onChange={handleMinChange}/>
                    <Text> : </Text>
                    <Input type='number' placeholder='sec' w={'80px'} textAlign={'center'} onChange={handleSecChange}/>
                  </HStack>
                  {!isErrorTime ? (
                      <FormHelperText>
                          Select the time.
                      </FormHelperText>
                  ) : (
                      <FormErrorMessage>time is required.</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isInvalid={isErrorAmount}>
                  <FormLabel>Amount DCR to Bet</FormLabel>
                  <Input type='text' value={amount} onChange={handleAmountChange} />
                  {!isErrorAmount ? (
                      <FormHelperText>
                          Enter the amount you'd like to bet.
                      </FormHelperText>
                  ) : (
                      <FormErrorMessage>Amount is required.</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </ModalBody>
            <ModalFooter>
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
              <Button disabled={isLoading} variant={'outline'} colorScheme='red' mr={3} onClick={handleClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )

}
