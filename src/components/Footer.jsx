import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  const lightGray = "var(--light-gray)";

  return (
    <Box py={4} px={8} borderTop="1px solid" borderColor="gray.100">
      <Flex justify="space-between" color={lightGray} fontSize="xs">
        <Text>V 1.0.1</Text>
        <Text>Copyright © 2024 Appzia Tec Solutions. All rights reserved.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
