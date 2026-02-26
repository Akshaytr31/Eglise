import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Table,
  IconButton,
  Text,
  Flex,
  Input,
  Icon,
} from "@chakra-ui/react";
import { LuPlus, LuPencil, LuEye, LuTrash2 } from "react-icons/lu";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FamilyFormModal from "../components/FamilyFormModal";
import {
  listFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
} from "../api/registryServices";

const FamilyPage = () => {
  const [families, setFamilies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const primaryMaroon = "var(--primary-maroon)";
  const primaryBlue = "#1a237e";

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setIsLoading(true);
    try {
      const response = await listFamilies();
      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error fetching families:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsLoading(true);
    try {
      if (selectedFamily) {
        await updateFamily(selectedFamily.id, formData);
      } else {
        await createFamily(formData);
      }
      fetchFamilies();
      onClose();
    } catch (error) {
      console.error("Error saving family:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this family?")) {
      try {
        await deleteFamily(id);
        fetchFamilies();
      } catch (error) {
        console.error("Error deleting family:", error);
      }
    }
  };

  const handleEdit = (family) => {
    setSelectedFamily(family);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedFamily(null);
    onOpen();
  };

  return (
    <Box bg="white" minH="100vh" display="flex" flexDirection="column">
      <Navbar />

      <Container maxW="container.xl" flex="1" py={8}>
        <Box
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          overflow="hidden"
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            px={6}
            py={4}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Heading size="md" fontWeight="medium">
              Families
            </Heading>
            <Button
              bg={primaryBlue}
              color="white"
              px={6}
              borderRadius="10px"
              fontWeight="bold"
              _hover={{ bg: "#151b4d" }}
              onClick={handleAddNew}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={LuPlus} fontSize="18px" />
              Add New
            </Button>
          </Flex>

          {/* Table Container */}
          <Box p={6}>
            <Flex justify="flex-end" mb={4} align="center" gap={2}>
              <Text fontWeight="600" fontSize="md">
                Search:
              </Text>
              <Input
                maxW="250px"
                size="md"
                borderRadius="10px"
                borderColor="gray.300"
              />
            </Flex>

            <Box
              border="1px"
              borderColor="gray.300"
              borderRadius="md"
              overflowX="auto"
            >
              <Table.Root variant="line">
                <Table.Header bg="gray.100">
                  <Table.Row>
                    <Table.ColumnHeader
                      textAlign="center"
                      borderRight="1px"
                      borderColor="gray.300"
                      py={4}
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      Sl No
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      borderRight="1px"
                      borderColor="gray.300"
                      py={4}
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      Family Name
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      textAlign="center"
                      py={4}
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {families.map((family, index) => (
                    <Table.Row
                      key={family.id}
                      _odd={{ bg: "gray.50" }}
                      _even={{ bg: "white" }}
                    >
                      <Table.Cell
                        textAlign="center"
                        borderRight="1px"
                        borderColor="gray.300"
                        py={4}
                        fontSize="md"
                      >
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell
                        borderRight="1px"
                        borderColor="gray.300"
                        py={4}
                        fontSize="md"
                        fontWeight="500"
                      >
                        {family.family_name}
                      </Table.Cell>
                      <Table.Cell py={4}>
                        <HStack spacing={3} justify="center">
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="blue.400"
                            color="blue.600"
                            borderRadius="6px"
                            onClick={() => handleEdit(family)}
                            _hover={{ bg: "blue.50" }}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Icon as={LuPencil} fontSize="14px" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="green.400"
                            color="green.600"
                            borderRadius="6px"
                            _hover={{ bg: "green.50" }}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Icon as={LuEye} fontSize="14px" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="red.400"
                            color="red.600"
                            borderRadius="6px"
                            onClick={() => handleDelete(family.id)}
                            _hover={{ bg: "red.50" }}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Icon as={LuTrash2} fontSize="14px" />
                            Delete
                          </Button>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  {families.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={3} textAlign="center" py={10}>
                        No families found.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Pagination Info */}
            <Flex justify="space-between" align="center" mt={6}>
              <Text fontSize="sm" color="gray.600">
                Showing {families.length > 0 ? 1 : 0} to {families.length} of{" "}
                {families.length} entries
              </Text>
              <HStack spacing={0}>
                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  borderRightRadius="0"
                  isDisabled
                >
                  Previous
                </Button>
                <Button
                  bg="#003399"
                  color="white"
                  size="sm"
                  borderRadius="0"
                  _hover={{ bg: "#002266" }}
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  borderLeftRadius="0"
                  isDisabled
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Box>
      </Container>

      <FamilyFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleCreateOrUpdate}
        familyData={selectedFamily}
        isLoading={isLoading}
      />

      <Footer />
    </Box>
  );
};

export default FamilyPage;
