import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Code,
  Link,
  Image,
} from "@chakra-ui/react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="center">
        <HStack spacing={8}>
          <Link href="https://vite.dev" isExternal>
            <Image src={viteLogo} h="100px" alt="Vite logo" />
          </Link>
          <Link href="https://react.dev" isExternal>
            <Image src={reactLogo} h="100px" alt="React logo" />
          </Link>
        </HStack>

        <Heading as="h1" size="2xl" textAlign="center">
          Vite + React + Chakra UI
        </Heading>

        <Box
          p={6}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          w="full"
          textAlign="center"
        >
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </Button>
          <Text mt={4}>
            Edit <Code>src/App.jsx</Code> and save to test HMR
          </Text>
        </Box>

        <Text color="gray.600" fontSize="lg">
          Click on the Vite and React logos to learn more
        </Text>
      </VStack>
    </Container>
  );
}

export default App;
