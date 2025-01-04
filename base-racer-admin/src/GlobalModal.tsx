import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { proxy, ref, useSnapshot } from 'valtio'

export const modalState = proxy({
    isOpen: false,
    onButtonClick: (open: boolean) => {
        modalState.isOpen = open
    },
    text: '',
    confirmButton: '',
})

export const showModal = (text: string, confirm = 'Delete'): Promise<boolean> => {
    modalState.text = text
    modalState.confirmButton = confirm
    modalState.isOpen = true
    return new Promise(resolve => {
        modalState.onButtonClick = ref((confirm: boolean) => {
            resolve(confirm)
        })
    })
}

export default () => {
    const { confirmButton, isOpen, text, onButtonClick } = useSnapshot(modalState)

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={isOpen => {
                    modalState.isOpen = isOpen
                    if (!isOpen) {
                        onButtonClick(false)
                    }
                }}
            >
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>{text}</ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="light"
                                    onPress={() => {
                                        modalState.isOpen = false
                                        onButtonClick(false)
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        modalState.isOpen = false
                                        onButtonClick(true)
                                    }}
                                >
                                    {confirmButton}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
