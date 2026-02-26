import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  const [activeMenu, setActiveMenu] = useState("Masters");
  const primaryMaroon = "var(--primary-maroon)";

  const menuData = {
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
        items: [
          "Student Activity",
          "Student Attendance",
          "Student Registration",
        ],
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

  const CategorySection = ({ title, items = [], subSections = [] }) => (
    <VStack align="start" spacing={3} w="full">
      <Heading as="h3" size="sm" color={primaryMaroon} fontWeight="bold">
        {title}
      </Heading>
      <VStack align="start" spacing={1} w="full">
        {items.map((item) => (
          <Link
            key={item}
            fontSize="md"
            color="gray.800"
            _hover={{ color: primaryMaroon, textDecoration: "underline" }}
          >
            {item}
          </Link>
        ))}
      </VStack>
      {subSections.map((sub) => (
        <VStack key={sub.title} align="start" spacing={3} w="full" pt={2}>
          <Heading as="h4" size="sm" color={primaryMaroon} fontWeight="bold">
            {sub.title}
          </Heading>
          <VStack align="start" spacing={1} w="full">
            {sub.items.map((item) => (
              <Link
                key={item}
                fontSize="md"
                color="gray.800"
                _hover={{ color: primaryMaroon, textDecoration: "underline" }}
              >
                {item}
              </Link>
            ))}
          </VStack>
        </VStack>
      ))}
    </VStack>
  );

  return (
    <Box bg="white" minH="100vh" display="flex" flexDirection="column">
      <Navbar onMenuClick={setActiveMenu} />

      <Container maxW="container.xl" flex="1" py={10}>
        <SimpleGrid
          columns={{ base: 1, md: 3, lg: 5 }}
          spacing={10}
          alignSelf="start"
        >
          {menuData[activeMenu]?.map((section) => (
            <CategorySection
              key={section.title}
              title={section.title}
              items={section.items}
              subSections={section.subSections}
            />
          ))}
        </SimpleGrid>
      </Container>

      <Footer />
    </Box>
  );
};

export default HomePage;
