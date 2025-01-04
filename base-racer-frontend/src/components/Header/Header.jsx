import {
  Box,
  Flex,
  Text,
  IconButton, Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue, useDisclosure,
  Image
} from "@chakra-ui/react"
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons"
import logo from "../../assets/logo.png"
import { GiBabyfootPlayers } from "react-icons/gi"
import { HiOutlineCubeTransparent } from "react-icons/hi"
import { BiTransferAlt } from "react-icons/bi"
import { WalletBtn } from "../WalletBtn/WalletBtn"
import { useNavigate } from "react-router-dom"
import { BlackCreateWalletButton } from "./CoinbaseButton"
import { useAccount } from "wagmi"

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { isConnected } = useAccount()

  return (
    <Box position={"sticky"} top={0} zIndex={20}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        height={"auto"}
        py={{ base: 2 }}
        px={{ base: 4, md: 10 }}
        borderBottom={1}
        borderStyle={"solid"}
        boxShadow={"0px 0px 10px 0px #1abcfc"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        justifyContent={"space-evenly"}
      >
        <Flex
          flex={{ base: 1, md: 1, lg: "auto" }}
          ml={{ base: "-1rem", md: "-2rem" }}
          display={{ base: "flex", md: "flex", lg: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        <Box position={'relative'} h='80px' flex={{base: '1', lg: "initial"}} mr={2}>
          <Image h='100%' src={logo} alt='logo' onClick={()=> navigate('/')} cursor={'pointer'} />
        </Box>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "center" }} display={{ base: "none", md: "none", lg: "flex" }} >
          <DesktopNav />
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={3}
          alignItems={'center'}
        >
          <Box display={{ base: "none", md: "block" }}>
            <BlackCreateWalletButton />
          </Box>
          <WalletBtn />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
      {!isConnected && <Box display={{ base: "flex", md: "none" }} marginTop={6} justifyContent={'center'}>
        <BlackCreateWalletButton />
      </Box>}
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();

  return (
    <Stack direction={"row"} spacing={"1.5rem"} mr={5}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label} ml={1} mr={2}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                // href={navItem.href ?? "#"}
                onClick={() => navigate(`${navItem.href ?? "#"}`)}
                fontSize={"xl"}
                fontWeight={900}
                color={linkColor}
                display={{ base: "none", md: "none", lg: "flex" }}
                alignItems={"center"}
                cursor={'pointer'}
                gap={2}
                _hover={{
                  textDecoration: "none",
                  color: "brand.100",
                }}
              >
                {navItem.icon}
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "flex", lg: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} icon={navItem.icon} children={undefined} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, icon }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        {/* {icon} */}
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  // {
  //   label: "Players",
  //   icon: <GiBabyfootPlayers />,
  // },
  // {
  //   label: "ZERO",
  //   icon: <AiOutlineDollarCircle />,
  // },
  {
    label: "Betting Page",
    icon: <HiOutlineCubeTransparent />,
    href: "/betting",
  },
  // {
  //   label: "Deposit",
  //   icon: <BiTransferAlt />,
  //   href: "/deposit",
  // },
  // {
  //   label: "Withdraw",
  //   icon: <FaMoneyBillWave />,
  //   href: "/withdraw",
  // },
  // {
  //   label: "Referrals",
  //   icon: <AiOutlineLink />,
  //   href: "#",
  // },
];
