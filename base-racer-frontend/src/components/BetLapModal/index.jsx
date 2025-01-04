import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from '@chakra-ui/react'
import { useRef } from 'react'
import { API } from "aws-amplify"
import { createBet } from './../../graphql/mutations'
import { useToast } from '@chakra-ui/react'
import { useUser } from '../../utils/user'

function index({ isOpen, onOpen, onClose, player, race_id, laps }) {
    const lap = useRef(null)
    const amount = useRef(null)
    const position = useRef(null)
    const user = useUser()
    const toast = useToast()

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bet on Lap</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <div>
                <img src={`${player?.contestantDetail.image}`} alt="" />
              </div>
              <FormControl>
                <FormLabel>Select Lap</FormLabel>
                <Select ref={lap} placeholder='Select option'>
                  {
                    laps && laps.length > 0 && laps.map((item, i) => (
                      <option key={i} value={item.id}>Lap {item.lapNumber}</option>
                    ))
                  }

                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Select Position</FormLabel>
                <Select ref={position} placeholder='Select option'>
                  <option value="FIRST">First</option>
                  <option value="SECOND">Second</option>
                  <option value="THIRD">Third</option>
                  <option value="FOURTH">Fourth</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Bet Amount</FormLabel>
                <Input ref={amount} placeholder='Enter Amount' />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              {/* <Button colorScheme='blue' mr={3} onClick={placeBet}>
                Place Bet
              </Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default index
