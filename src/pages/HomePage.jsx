import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import authService from "../auth/authService";

const HomePage = () => {
  const primaryGold = "var(--primary-gold)";
  const white = "var(--white)";

  return (
    <Box bg={white} minH="100vh">
      <Container maxW="container.md" py={20}>
        <VStack
          spacing={8}
          align="center"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor={primaryGold}
        >
          <Heading as="h1" size="2xl" color={primaryGold}>
            Welcome to Eglise
          </Heading>

          <Text fontSize="xl" textAlign="center">
            You have successfully logged in. This is your home page.
          </Text>

          <Box p={6} w="full" textAlign="center">
            <Button
              bg={primaryGold}
              color={white}
              size="lg"
              _hover={{ bg: "#d4a455" }}
              onClick={() => {
                authService.logout();
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
