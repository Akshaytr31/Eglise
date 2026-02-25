import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import EgliseLogo from "../assets/EgliseLogo.png";

const Navbar = () => {
  const primaryMaroon = "#AE2050";

  return (
    <Box
      py={4}
      px={8}
      borderBottom="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
    >
      <Flex align="center" direction="column" gap={0}>
        <HStack spacing={4}>
          <Box>
            <Image src={EgliseLogo} alt="Eglise Logo" maxH="60px" />
          </Box>
          <VStack align="start" spacing={0}>
            <Heading
              as="h1"
              size="2xl"
              color={primaryMaroon}
              letterSpacing="wider"
              fontFamily="'Brush Script MT', cursive"
            >
              Eglise
            </Heading>
            <Text
              fontSize="xs"
              fontWeight="normal"
              color={primaryMaroon}
              mt="-4px"
            >
              Complete Solution for Parish Management
            </Text>
          </VStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
