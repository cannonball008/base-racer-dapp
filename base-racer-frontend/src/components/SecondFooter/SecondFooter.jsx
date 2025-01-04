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
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
// import { SiFarcaster } from 'react-icons/si';
import { SiFarcaster, SiLinktree, SiTelegram } from "@icons-pack/react-simple-icons"
import baseLogoWebp from '../../base-logo.webp'
import begambleaware from './begambleaware.ico'
//@ts-ignore
import DexTools from './dextools.svg?react'
import termsFile from "../../assets/terms.pdf";

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
      rel={"noopener noreferrer"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export default function SecondFooter() {
  return (
    <Box
      bg={"transparent"}
      color={useColorModeValue("gray.700", "gray.200")}
      mt={"8rem"}
    >
      <Container
        as={Stack}
        maxW={"8xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "center" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>© 2024 Base Racer. <a href={termsFile}>Terms of use</a></Text>
        <AllSocialLinks />
      </Container>
      <Container
        as={Stack}
        maxW={"8xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "center" }}
        align={{ base: "center", md: "center" }}
      >
        <BaseNote />
      </Container>
    </Box>
  )
}

export function BaseNote() {
  return <div style={{ display: "flex", gap: 10, height: 20, alignItems: "center", }}>
    <a href="https://base.org">Built on Base!</a>
  </div>
}

export function AllSocialLinks() {
  return <>
    <Stack direction={"row"} spacing={6}>
      <SocialButton label={"Twitter"} href={"https://x.com/Base_Racer_ayb"}>
        <FaTwitter />
      </SocialButton>
      {/* <SocialButton label={"Warpcast"} href={"https://warpcast.com/diecastracer"}>
        <SiFarcaster />
      </SocialButton> */}
      <SocialButton label={"Dextools"} href={"https://www.dextools.io/app/en/base/pair-explorer/0x7cb15019adfbce42bffba0958e9901d0cef5ef69?t=1732642679339"}>
        <DexTools width="28" height="28" />
      </SocialButton>
      {/* <SocialButton label={"Linktree"} href={"https://linktr.ee/diecastracer"}>
        <SiLinktree />
      </SocialButton> */}
      <SocialButton label={"Telegram"} href={"https://t.me/allyourbase"}>
        <SiTelegram />
      </SocialButton>
      <SocialButton label={"Responsible Gaming"} href={"https://www.gambleaware.org/"}>
        <img src={begambleaware} width={28} height={28} />
      </SocialButton>
    </Stack>
  </>
}
