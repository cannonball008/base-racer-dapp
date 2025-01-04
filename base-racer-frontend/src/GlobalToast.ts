import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'

export const toastState = proxy({
    message: ''
})

export default () => {
    const toast = useToast()
    const { message } = useSnapshot(toastState)

    useEffect(() => {
        if (message) {
            toast({
                title: message,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
    }, [message])

    return null
}
