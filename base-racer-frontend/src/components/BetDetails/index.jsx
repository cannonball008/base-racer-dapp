import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Avatar
} from "@chakra-ui/react";

const index = ({bets}) => {
  const betType = (bet) => {
    if (bet.betType === 'LAP') return `Lap ${bet.lap}`
    return 'Full Race'
  }

  return (
    <section className="wrap" style={{margin: 'auto'}}>
      <TableContainer >
        <Table colorScheme="twitter">
          <Thead>
            <Tr>
              <Th>Bet Type</Th>
              <Th>Player</Th>
              <Th isNumeric>Bet Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              bets && bets.length > 0 && bets.map((bet, i) => (
                <Tr key={i}>
                  <Td>{betType(bet)}</Td>
                  <Td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <Avatar size='md' name={bet?.contestantName} src={`${bet?.contestantImage}`} />
                      <span style={{marginLeft: '10px'}}>{bet?.contestantName}</span>
                    </div>
                  </Td>
                  <Td isNumeric>{bet?.amount} DCR</Td>
                </Tr>
              ))
            }


          </Tbody>

        </Table>
      </TableContainer>
    </section>
  );
};

export default index;
