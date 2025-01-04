import {
  Heading,
  Image,
  ListItem,
  UnorderedList,
  chakra,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { RxCross2 } from "react-icons/rx";

const PreviousPlayerModal = ({ open, setOpen, bets }) => {
  const pageSize = 20;
  const [page, setPage] = React.useState(0);
  const bettingArray = bets;

  return (
    <>
      <Modal isOpen={open} onClose={() => setOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent
          height={{ base: "80vh", md: "50vh" }}
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.5rem",
            },
            "&::-webkit-scrollbar-track": {
              width: "0.5rem",
              background: "#171923",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "24px",
            },
          }}
        >
          <ModalHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"1.5rem"}>Current Betting</Text>
            <RxCross2
              onClick={() => setOpen(false)}
              color="#fff"
              fontSize={"1.5rem"}
              // display={{ base: "block", md: "block" }}
            />
          </ModalHeader>
          <ModalCloseButton />

          <chakra.div
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            width={"100%"}
            p={2}
            gap={"1rem"}
            sx={
              {
                //   height: "100%", // Set the height to 100% to fill the available space
                //   overflowY: "auto", // Enable vertical scrolling when content overflows
                //   overflowX: "hidden", // Disable horizontal scrolling
              }
            }
          >
            <UnorderedList fontSize={".8rem"} listStyleType={"none"} spacing={3} width={'100%'} mx={5}>
            {bettingArray
              .slice(page * pageSize, page * pageSize + pageSize)
              .map((item, i) => (

                  <ListItem
                    key={i}
                    bg={"#1A202C"}
                    py={3}
                    px={4}
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    alignItems={"center"}
                    cursor={"pointer"}

                    fontWeight={300}
                    _hover={{
                      color: "gray.400",
                    }}
                  >
                    <span>{item.betterDetail.username.slice(0,5)+'......'+item.betterDetail.username.slice(37,42)}</span>
                    <span>{item.amount} DCR</span>
                  </ListItem>

              ))}
              </UnorderedList>
          </chakra.div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PreviousPlayerModal;
