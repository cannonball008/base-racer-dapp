"use client"

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react"
import termsFile from "../../assets/terms.pdf";
import { AllSocialLinks, BaseNote } from "../SecondFooter/SecondFooter"
import {Link} from "react-router-dom";

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      position={'fixed'}
      bottom={0}
      w={'100vw'}
    >
      <Container
        as={Stack}
        maxW={"8xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>© 2024 Base Racer by All Your Base ($AYB)</Text>
        <Text><a href={termsFile}>Terms of Use.</a></Text>
        {/* <Text>© 2024 Base Racer by All Your Base ($AYB). <a href={termsFile}>Terms of Use.</a></Text> */}

        <Stack direction={"row"} spacing={6}>
          <AllSocialLinks />
        </Stack>
        <BaseNote />
      </Container>
    </Box>
  )
}
