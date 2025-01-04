import Header from "../../components/Header/Header"
import { Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spinner, Text, useToast  } from '@chakra-ui/react'

import { BNB } from './../../icons'
import { useState, useContext } from "react"
import Footer from "../../components/Footer/Footer"
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi"

import { useDebounce } from 'use-debounce'
import { parseEther } from 'viem'

// import {CONFIG} from './../../config/config'


const index = () => {
    const [input, setInput] = useState('')
    const [debouncedAmount] = useDebounce(input, 500)
    const toast = useToast()

    const { openConnectModal } = useConnectModal();
    const regexp = /^\d+(\.\d{1,18})?$/;

    const {address, isConnected} = useAccount();

    const isError = (input === '' || !regexp.test(input))
    console.log(!regexp.test(input))

    const handleInputChange = (e) => setInput(e.target.value)

    // const { config } = usePrepareSendTransaction({
    //     to: CONFIG.CONTRACT_ADDRESS,
    //     value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    //   })
    const config = {}

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!isError) {
        }
    }

  return (
    <>
        <Header />
        <Box p={5} mt={10} w={['100%', 400, 500]} mx={'auto'}>
            <Box textAlign={'center'}>
                <Heading size={'2xl'} >Deposit</Heading>
                <Box  mt={5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <BNB></BNB>
                </Box>
                <Text mt={5} fontSize={'2xl'}>Deposit BNB</Text>
                <Text>You will be credited DCR that represents your deposit. You can withdraw your DCR at any time.</Text>
            </Box>
            <Box mt={8}>
                <FormControl isInvalid={isError}>
                    <FormLabel>Amount BNB to deposit</FormLabel>
                    <Input type='text' value={input} onChange={handleInputChange} />
                    {!isError ? (
                        <FormHelperText>
                            Enter the amount you'd like to deposit.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>Amount is required.</FormErrorMessage>
                    )}
                </FormControl>
                {/* <Button disabled={isLoading} mt={5} colorScheme='facebook' variant='outline' size={'lg'} w={'100%'} onClick={handleSubmit}>
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
                        !isLoading && 'Deposit'

                    }

                </Button> */}
            </Box>
        </Box>
        <Footer></Footer>
    </>
  )
}

export default index
