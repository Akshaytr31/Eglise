import React from "react";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { LuChevronDown, LuMenu } from "react-icons/lu";
import EgliseLogo from "../assets/logo.png";

const Navbar = ({ onMenuClick }) => {
  const primaryMaroon = "var(--primary-maroon)";

  const NavItem = ({ label }) => (
    <HStack
      spacing={1}
      cursor="pointer"
      _hover={{ color: primaryMaroon }}
      onClick={() => onMenuClick && onMenuClick(label)}
    >
      <Text fontWeight="medium" color={primaryMaroon} fontSize="lg">
        {label}
      </Text>
      <Icon as={LuChevronDown} color={primaryMaroon} boxSize={4} />
    </HStack>
  );

  return (
    <Box
      py={2}
      px={8}
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" justify="space-between">
        {/* Left: Logo */}
        <Box>
          <Image src={EgliseLogo} alt="Eglise Logo" maxH="50px" />
        </Box>

        {/* Center: Nav Items */}
        <HStack spacing={12} display={{ base: "none", md: "flex" }}>
          <NavItem label="Masters" />
          <NavItem label="Activities" />
          <NavItem label="Reports" />
        </HStack>

        {/* Right: Menu Icon */}
        <Box>
          <IconButton
            variant="ghost"
            aria-label="Menu"
            icon={<LuMenu size={24} color={primaryMaroon} />}
            _hover={{ bg: "gray.100" }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
