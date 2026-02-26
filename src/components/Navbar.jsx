import React from "react";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Icon,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";
import { LuChevronDown, LuMenu, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import EgliseLogo from "../assets/logo.png";
import authService from "../auth/authService";

const Navbar = ({ activeItem, onMenuClick }) => {
  const primaryMaroon = "var(--primary-maroon)";
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const NavItem = ({ label, isActive }) => (
    <HStack
      spacing={2}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ opacity: 0.8 }}
      onClick={() => onMenuClick && onMenuClick(label)}
    >
      <Text
        fontWeight="medium"
        color={isActive ? primaryMaroon : "gray.500"}
        fontSize="1.1rem"
      >
        {label}
      </Text>
      <Flex
        align="center"
        justify="center"
        border="1px solid"
        borderColor={isActive ? primaryMaroon : "gray.400"}
        borderRadius="4px"
        p="2px"
      >
        <Icon
          as={LuChevronDown}
          color={isActive ? primaryMaroon : "gray.400"}
          boxSize={3}
        />
      </Flex>
    </HStack>
  );

  return (
    <Box
      py={4}
      px={8}
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" justify={isLoggedIn ? "space-between" : "center"}>
        {/* Left/Center: Logo */}
        <Box>
          <Image src={EgliseLogo} alt="Eglise Logo" maxH="60px" />
        </Box>

        {isLoggedIn && (
          <>
            {/* Center: Nav Items */}
            <HStack spacing={10} display={{ base: "none", md: "flex" }}>
              <NavItem label="Masters" isActive={activeItem === "Masters"} />
              <NavItem
                label="Activities"
                isActive={activeItem === "Activities"}
              />
              <NavItem label="Reports" isActive={activeItem === "Reports"} />
            </HStack>

            {/* Right: Menu Icon with Dropdown */}
            <Box>
              <MenuRoot positioning={{ placement: "bottom-end", gutter: 12 }}>
                <MenuTrigger asChild>
                  <Flex
                    align="center"
                    justify="center"
                    border="2px solid"
                    borderColor={primaryMaroon}
                    borderRadius="12px"
                    p={2}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    _active={{ bg: "transparent" }}
                    _focus={{ outline: "none" }}
                    _focusVisible={{ outline: "none" }}
                  >
                    <Icon as={LuMenu} color={primaryMaroon} boxSize={6} />
                  </Flex>
                </MenuTrigger>
                <MenuContent
                  position="absolute"
                  right="3"
                  top="100%"
                  mt={2}
                  borderColor="gray.200"
                  boxShadow="lg"
                  py={2}
                  borderRadius="12px"
                  minW="150px"
                  zIndex={20}
                >
                  <MenuItem
                    value="logout"
                    onClick={handleLogout}
                    color={primaryMaroon}
                    fontWeight="medium"
                    _hover={{ bg: "gray.50" }}
                  >
                    <Icon as={LuLogOut} color={primaryMaroon} mr={2} />
                    Logout
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
