import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import FullRaceBet from './FullRaceBet'
import RaceLapBet from './RaceLapBet'
import { RaceType } from '../../pages/Betting/Betting'
import { useEffect, useState } from 'react'


function index({ isOpen, onOpen, onClose, player, race_obj: _race_obj,race_id,  betType }) {
    const raceObj = _race_obj as RaceType
    const canBetFull = raceObj?.activeRace?.betStatus === 'OPEN'

    return (
      <>
        <Modal
         closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          motionPreset='slideInBottom'
          size={'lg'}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Place Bet on {player?.contestantDetail.name}</ModalHeader>
            <ModalBody pb={6}>
              <div>
                <img src={`${player?.contestantDetail.image}`} alt="" />
              </div>

              {/* <Tabs isFitted variant='enclosed-colored' width={'100%'}>
                <TabList mb='1em'>
                  <Tab disabled={!canBetFull}>Full Race</Tab>
                  <Tab>Lap</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {canBetFull && <FullRaceBet race_id={race_id} player={player} onClose={onClose} ></FullRaceBet>}
                  </TabPanel>
                  <TabPanel>
                    <RaceLapBet player={player} race_id={race_id} onClose={onClose} _race={raceObj}></RaceLapBet>
                  </TabPanel>
                </TabPanels>
              </Tabs> */}
              <RaceLapBet player={player} race_id={race_id} onClose={onClose} _race={raceObj} betType={betType}></RaceLapBet>

            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default index
