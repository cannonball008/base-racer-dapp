import { Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { formatEther } from 'viem'
import { getTokenContract, tokenAddress } from "../CreateBetModal/placeBet"
import { contractState } from "../../pages/contract"
import { useAccount, useWalletClient } from "wagmi"
import useChainId from "../../hooks/useChainId"
import { useSnapshot } from "valtio"
import SwapModalContent from '../../SwapModalContent'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useMedia } from 'react-use'

const index = ({ balance, symbol }) => {
  const { isConnected, address } = useAccount()
  const [updateCount, setUpdateCount] = useState(0)
  const { unsupported } = useChainId()

  const [tokenBalance, setTokenBalance] = useState('')
  const { data: client } = useWalletClient()

  useEffect(() => {
    if (!address) return
    const loadBalance = async () => {
      const tokenContract = await getTokenContract(client)
      if (tokenContract) {
        const balance = await tokenContract.read.balanceOf([address])
        setTokenBalance(parseFloat(formatEther(balance)).toFixed(3))
      }
    }
    loadBalance().catch((err) => {
      console.error(err)
      setTokenBalance('')
    })
  }, [isConnected, address, unsupported, updateCount])

  const { contract } = useSnapshot(contractState)
  useEffect(() => {
    if (!contract) return
    const udpateFn = () => {
      setTimeout(() => {
        udpateFn()
      }, 500)
    }
    contract.on('BetDeleted', () => {
      udpateFn()
    })
    contract.on('BetCreated', () => {
      udpateFn()
    })
    contract.on('RaceRewardClaimed', () => {
      udpateFn()
    })
    contract.on('LapRewardClaimed', () => {
      udpateFn()
    })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    let isVisible = true
    document.addEventListener('visibilitychange', (e) => {
      if (document.visibilityState === 'visible') {
        isVisible = true
      } else {
        isVisible = false
      }
    }, { signal })
    let interval = setInterval(() => {
      setUpdateCount((prev) => prev + 1)
    }, 1000)
    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  const [modalOpen, setModalOpen] = useState(false)

  const token = tokenAddress
  const onClose = () => setModalOpen(false)
  const isSmall = useMedia('(max-width: 640px)')

  return (
    <>
      <Modal
        size={isSmall ? 'full' : 'xl'}
        isOpen={modalOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent /* width='550px' maxWidth='90%' */>
          <ModalHeader>Swap</ModalHeader>
          <ModalBody display='flex' justifyContent='center'>
            {/* <div className="max-sm:scale-[0.65]"> */}
            <div>
              <SwapModalContent onClose={() => {
                onClose()
                setUpdateCount((prev) => prev + 1)
              }} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div style={{ padding: '15px', marginBottom: '20px', border: '1px solid #1681BF', marginLeft: '10px', marginRight: '10px' }}>
        <Stat>
          <StatLabel>Balance</StatLabel>
          <StatNumber>{!tokenBalance ? '-' : tokenBalance} {DiecastRacingTokenSymbol}</StatNumber>
          <StatNumber fontSize={'small'}>{balance === undefined ? '-' : balance} {symbol}</StatNumber>
          <a target='_blank' rel='noreferrer noopener'
            // href={`https://app.uniswap.org/swap?exactField=output&inputCurrency=eth&outputCurrency=${token}&chain=base`}
            onClick={() => setModalOpen(true)}
            style={{
              fontWeight: 'bold',
              // some kind of purple link
              color: '#2bc6e2',
              cursor: "pointer",
            }}>Buy $AYB</a>
        </Stat>
      </div>
    </>
  )

}

const DiecastRacingTokenSymbol = 'AYB'

export default index
