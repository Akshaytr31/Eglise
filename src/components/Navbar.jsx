import React from "react";
import {
  Box,
  Flex,
  HStack,
  Image,
} from "@chakra-ui/react";
import EgliseLogo from "../assets/logo.png";

const Navbar = () => {
  return (
    <Box
      py={1}
      px={8}
      borderBottom="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
    >
      <Flex align="center" justify="center">
        <HStack spacing={4}>
          <Box>
            <Image src={EgliseLogo} alt="Eglise Logo" maxH="70px" />
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
