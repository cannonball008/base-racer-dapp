import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Betting from "./pages/Betting/Betting"
import Landing from "./pages/Landing/Landing"
import View from "./pages/View"
import { useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import axios from "axios"


function App() {
  const toast = useToast()
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true)
  const RESTRICTED_COUNTRIES = [
    'IR', // Iran
    'KP', // North Korea
    'CU', // Cuba
    'SY', // Syria
    'CN', // China
    'AF', // Afghanistan
    'CF', // Central African Republic
    'CD', // Congo (the Democratic Republic of)
    'LY', // Libya
    'ML', // Mali
    'SO', // Somalia
    'SD', // Sudan
    'YE'  // Yemen
  ]

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`https://ipinfo.io?token=5a140ed729c6dd`, { signal })
        const userCountry = response.data.country

        console.log('User Country:', userCountry)
        // Check if user's country is allowed
        if (RESTRICTED_COUNTRIES.includes(userCountry)) {
          setIsAllowed(false)
        } else {
          setIsAllowed(true)
        }
      } catch (error) {
        console.error('Error fetching user location:', error)
        setIsAllowed(true)
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
    window.addEventListener('error', e => {
      console.error(e)
      toast({
        title: "Error",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }, {
      signal
    })

    window.addEventListener('unhandledrejection', e => {
      console.log('e', e)
      const err = e.reason
      let message = err.message
      //@ts-ignore
      if (err.info?.error?.data?.message) message = err.info.error.data.message
      else if (err.info?.error?.message) message = err.info.error.message
      else if (err.details) message = err.details
      else if (err.cause) message = err.cause
      toast({
        title: "Error",
        description: String(message),
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }, {
      signal
    })

    return () => controller.abort()
  })
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAllowed) {
    return (
        <div>
          <h1>Access Restricted</h1>
          <p>Your country is not allowed to access this application.</p>
        </div>
    )
  }
  const router = createBrowserRouter([
    {
      path: "/",
      Component: View,
      children: [
        {
          path: "/",
          element: <Landing />,
        },

        {
          path: "/betting",
          element: <Betting />,
        },
      ],
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
