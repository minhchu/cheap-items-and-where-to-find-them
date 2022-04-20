import {
  ChakraProvider,
  Box,
  theme,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Container,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { db } from "./db";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const List = () => {
  const [name, setName] = useState("");

  const items = useLiveQuery(async () => {
    if (name) {
      return await db.items.where("name").startsWithIgnoreCase(name).toArray();
    }

    return await db.items.toArray();
  }, [name]);

  return (
    <TableContainer>
      <Box mt={2} p={0.5}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search ..."
        />
      </Box>
      <Table variant="striped" colorScheme="teal">
        <TableCaption placement="top">Items list</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th isNumeric>Price</Th>
            <Th>Store address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.name}</Td>
              <Td isNumeric>{formatter.format(item.price)}</Td>
              <Td>{item.store_address}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export const App = () => {
  const onSubmit = (e: any) => {
    e.preventDefault();
    db.items.add({
      name: e.target[0].value as string,
      price: e.target[1].valueAsNumber as number,
      store_address: e.target[2].value as string,
    });
    e.target.reset();
  };

  return (
    <ChakraProvider theme={theme}>
      <Container>
        <ColorModeSwitcher justifySelf="flex-end" />
        <form onSubmit={onSubmit}>
          <Input placeholder="item name" mb={2} />
          <Input placeholder="price" type="number" mb={2} />
          <Input placeholder="store address" mb={2} />
          <Button colorScheme="blue" type="submit">
            Save
          </Button>
        </form>
        <List />
      </Container>
    </ChakraProvider>
  );
};
