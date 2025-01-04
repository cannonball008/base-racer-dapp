import { Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Spinner, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useUser } from "../../utils/user"

const FullRaceBet = ({ player, race_id, onClose }) => {

    const [amount, setAmount] = useState('')
    const [isLoading, setLoading] = useState(false)
    const user = useUser()
    const toast = useToast()

    const regexp = /^\d+(\.\d{1,18})?$/

    const isError = (amount === '' || !regexp.test(amount))

    const handleInputChange = (e) => setAmount(e.target.value)

    const handleClose = () => {
        setAmount('')
        onClose()
    }

    const placeBet = async () => {
        if (!isError) {
            if (user) {
                try {
                    setLoading(true)
                    const fullRace = false
                    // await makeBet(race_id, player.id, amount)
                    setLoading(false)
                    onClose()
                    toast({
                        title: "Full Race Bet",
                        description: "Bet on race placed successfully",
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

    return (
        <>
            <Box mt={8}>
                <FormControl isInvalid={isError}>
                    <FormLabel>Amount DCR to Bet</FormLabel>
                    <Input type='text' value={amount} onChange={handleInputChange} />
                    {!isError ? (
                        <FormHelperText>
                            Enter the amount you'd like to bet.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>Amount is required.</FormErrorMessage>
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

export default FullRaceBet
