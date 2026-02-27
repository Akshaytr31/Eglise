import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Icon,
  SimpleGrid,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { LuChevronDown, LuMenu, LuLogOut } from "react-icons/lu";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import EgliseLogo from "../assets/logo.png";
import authService from "../auth/authService";

// ─── Route map: item label → path (only items with a real page) ───────────────
const ROUTE_MAP = {
  Family: "/family",
  Ward: "/ward",
  Grade: "/grade",
  Relationship: "/relationship",
};

// ─── Menu data ────────────────────────────────────────────────────────────────
const MENU_DATA = {
  Masters: [
    {
      title: "Church Configuration",
      items: ["Church Info", "Priest Master", "Diocese"],
    },
    {
      title: "Members",
      items: ["Family", "Relationship", "Ward", "Grade"],
    },
    {
      title: "Miscellaneous",
      items: [
        "Member Offers",
        "Tomb Type",
        "Designation",
        "Subscriptions",
        "Tomb Fees",
        "Events",
      ],
    },
    {
      title: "Accounts",
      items: ["Account Ledger", "Ledger Group"],
      subSections: [
        {
          title: "Sunday School",
          items: ["Class", "Division", "Set Academic Year"],
        },
      ],
    },
    {
      title: "Users & Roles",
      items: ["Users", "User Roles", "User Permissions"],
    },
  ],
  Activities: [
    {
      title: "Members",
      items: [
        "Member Info",
        "Baptism Register",
        "Marriage Register",
        "Death Register",
      ],
    },
    {
      title: "Accounts",
      items: ["Receipts", "Payments", "Qurbana Receipts"],
    },
    {
      title: "Miscellaneous",
      items: ["Priest Change", "Visitor Management", "Committee"],
    },
    {
      title: "Sunday School",
      items: ["Student Activity", "Student Attendance", "Student Registration"],
    },
  ],
  Reports: [
    {
      title: "Members",
      items: ["Member List", "Age Wise List", "Phone Directory"],
      subSections: [
        {
          title: "Registers",
          items: ["Baptism Register", "Marriage Register", "Death Register"],
        },
      ],
    },
    {
      title: "Accounts",
      items: [
        "Day Book",
        "Cash Book",
        "Bank Book",
        "General Ledger",
        "Member Ledger",
        "Income Expenditure",
        "Subscription Due List",
        "Donations Register",
        "Subscription Receipts",
      ],
    },
    {
      title: "Committee",
      items: ["List of Committee", "Committee Members"],
    },
    {
      title: "Sunday School",
      items: ["Student Activity", "Student List", "Student Attendance"],
    },
  ],
};

// ─── A single menu link ────────────────────────────────────────────────────────
const MenuLink = ({ label, onClose, primaryMaroon }) => {
  const route = ROUTE_MAP[label];
  const sharedStyle = {
    fontSize: "sm",
    color: "gray.700",
    cursor: "pointer",
    display: "block",
    py: "1px",
    _hover: { color: primaryMaroon, textDecoration: "underline" },
  };

  if (route) {
    return (
      <Box as={RouterLink} to={route} onClick={onClose} {...sharedStyle}>
        {label}
      </Box>
    );
  }
  return (
    <Box as="a" href="#" onClick={(e) => e.preventDefault()} {...sharedStyle}>
      {label}
    </Box>
  );
};

// ─── A category column ────────────────────────────────────────────────────────
const CategoryColumn = ({ section, onClose, primaryMaroon }) => (
  <VStack align="start" spacing={1.5}>
    <Heading
      as="h4"
      fontSize="xs"
      fontWeight="700"
      color={primaryMaroon}
      textTransform="uppercase"
      letterSpacing="wider"
      mb={1}
    >
      {section.title}
    </Heading>
    {section.items.map((item) => (
      <MenuLink
        key={item}
        label={item}
        onClose={onClose}
        primaryMaroon={primaryMaroon}
      />
    ))}
    {section.subSections?.map((sub) => (
      <VStack key={sub.title} align="start" spacing={1} pt={2} w="full">
        <Heading
          as="h5"
          fontSize="xs"
          fontWeight="700"
          color={primaryMaroon}
          textTransform="uppercase"
          letterSpacing="wider"
          mb={1}
        >
          {sub.title}
        </Heading>
        {sub.items.map((item) => (
          <MenuLink
            key={item}
            label={item}
            onClose={onClose}
            primaryMaroon={primaryMaroon}
          />
        ))}
      </VStack>
    ))}
  </VStack>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const primaryMaroon = "var(--primary-maroon)";
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  // Which menu label is open; null = closed
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  // Close when clicking outside the entire navbar
  useEffect(() => {
    const handler = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setActiveMenu(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (label) =>
    setActiveMenu((prev) => (prev === label ? null : label));

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const activeSections = activeMenu
    ? MENU_DATA[activeMenu]
    : Object.values(MENU_DATA)[0];

  return (
    <Box
      ref={navbarRef}
      position="sticky"
      top={0}
      zIndex={50}
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
    >
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <Flex
        align="center"
        justify={isLoggedIn ? "space-between" : "center"}
        py={'10px'}
        px={8}
      >
        {/* Logo */}
        <Box>
          <Image src={EgliseLogo} alt="Eglise Logo" maxH="40px" />
        </Box>

        {isLoggedIn && (
          <>
            {/* Center: Nav triggers */}
            <HStack
              spacing={10}
              gap={"30px"}
              display={{ base: "none", md: "flex" }}
            >
              {Object.keys(MENU_DATA).map((label) => {
                const isOpen = activeMenu === label;
                return (
                  <HStack
                    key={label}
                    spacing={1.5}
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => toggle(label)}
                    _hover={{ opacity: 0.8 }}
                    transition="all 0.2s"
                  >
                    <Text
                      fontWeight="medium"
                      color={isOpen ? "#6b0f1a" : primaryMaroon}
                      fontSize="1.05rem"
                    >
                      {label}
                    </Text>
                    <Flex
                      align="center"
                      justify="center"
                      border="1px solid"
                      borderColor={isOpen ? "#6b0f1a" : primaryMaroon}
                      borderRadius="4px"
                      p="2px"
                      transition="transform 0.5s"
                      transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                    >
                      <Icon
                        as={LuChevronDown}
                        color={isOpen ? "#6b0f1a" : primaryMaroon}
                        boxSize={3}
                      />
                    </Flex>
                  </HStack>
                );
              })}
            </HStack>

            {/* Right: Hamburger + absolute logout dropdown */}
            <Box position="relative">
              <Flex
                align="center"
                justify="center"
                // border="2px solid"
                borderColor={primaryMaroon}
                borderRadius="8px"
                p={2}
                cursor="pointer"
                onClick={() => setMenuOpen((o) => !o)}
                _hover={{ opacity: 0.8 }}
              >
                <Icon as={LuMenu} color={primaryMaroon} boxSize={5} />
              </Flex>

              <Box
                position="absolute"
                top="calc(100% + 10px)"
                right={0}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="12px"
                boxShadow="sm"
                py={1}
                minW="150px"
                zIndex={200}
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
                  pointerEvents: menuOpen ? "auto" : "none",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
              >
                <Flex
                  align="center"
                  gap={2}
                  px={4}
                  py={2.5}
                  cursor="pointer"
                  color={primaryMaroon}
                  fontWeight="medium"
                  fontSize="sm"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <Icon as={LuLogOut} fontSize="15px" />
                  Logout
                </Flex>
              </Box>
            </Box>
          </>
        )}
      </Flex>

      {/* ── Full-width dropdown panel ─────────────────────────────────────── */}
      <Box
        position="absolute"
        top="100%"
        left={0}
        right={0}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="md"
        px={8}
        py={5}
        zIndex={49}
        style={{
          opacity: activeMenu ? 1 : 0,
          transform: activeMenu ? "translateY(0)" : "translateY(-10px)",
          pointerEvents: activeMenu ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.5s ease",
        }}
      >
        <SimpleGrid
          columns={{ base: 2, md: activeSections.length }}
          spacing={8}
          alignItems="start"
        >
          {activeSections.map((section) => (
            <CategoryColumn
              key={section.title}
              section={section}
              onClose={() => setActiveMenu(null)}
              primaryMaroon={primaryMaroon}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Navbar;
