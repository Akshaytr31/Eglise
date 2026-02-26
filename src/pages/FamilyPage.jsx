import React, { useState, useEffect, useCallback } from "react";
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
  Skeleton,
} from "@chakra-ui/react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FamilyFormModal from "../components/FamilyFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const primaryMaroon = "var(--primary-maroon)";

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
      setCurrentPage(1); // Reset to first page on fetch
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

  const handleDelete = (id) => {
    setFamilyToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFamily(familyToDelete);
      fetchFamilies();
    } catch (error) {
      console.error("Error deleting family:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setFamilyToDelete(null);
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

  // Pagination Logic
  const totalPages = Math.ceil(families.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedFamilies = families.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Returns an array of page numbers / "..." strings for ellipsis pagination
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const delta = 1; // siblings on each side of currentPage
    const left = currentPage - delta;
    const right = currentPage + delta;

    // Always include page 1
    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");

    // Always include last page
    pages.push(totalPages);

    return pages;
  };

  return (
    <Box bg="white" minH="100vh" display="flex" flexDirection="column">
      <Navbar />

      <Container maxW="container.xl" flex="1" py={8}>
        <Box
          border="1px"
          borderColor="gray.200"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="sm"
          bg="white"
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            px={8}
            py={6}
            borderBottom="2px"
            borderColor={primaryMaroon}
            bg="white"
          >
            <Heading
              size="lg"
              color={primaryMaroon}
              fontWeight="700"
              letterSpacing="tight"
            >
              Family Directory
            </Heading>
            <Button
              bg={primaryMaroon}
              color="white"
              px={8}
              h="48px"
              borderRadius="lg"
              fontWeight="bold"
              _hover={{
                bg: "#6b0f1a",
                transform: "translateY(-1px)",
                boxShadow: "md",
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={handleAddNew}
              display="flex"
              alignItems="center"
              gap={2}
              transition="all 0.2s"
            >
              <Icon as={LuPlus} fontSize="20px" />
              Add New Family
            </Button>
          </Flex>

          {/* Table Container */}
          <Box p={8}>
            <Flex justify="flex-end" mb={6} align="center" gap={3}>
              <Text fontWeight="600" fontSize="md" color="gray.600">
                Search:
              </Text>
              <Input
                placeholder="Search families..."
                maxW="300px"
                size="md"
                borderRadius="lg"
                borderColor="gray.200"
                _focus={{
                  borderColor: primaryMaroon,
                  boxShadow: `0 0 0 1px ${primaryMaroon}`,
                }}
              />
            </Flex>

            <Box
              border="1px"
              borderColor="gray.100"
              borderRadius="xl"
              overflowX="auto"
              boxShadow="inner"
            >
              <Table.Root variant="line">
                <Table.Header bg="gray.50">
                  <Table.Row borderBottom="2px" borderColor="gray.100">
                    <Table.ColumnHeader
                      textAlign="center"
                      borderRight="1px"
                      borderColor="gray.100"
                      py={5}
                      fontWeight="700"
                      fontSize="md"
                      color="gray.700"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      SI No
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      textAlign="center"
                      borderRight="1px"
                      borderColor="gray.100"
                      py={5}
                      fontWeight="700"
                      fontSize="md"
                      color="gray.700"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Family Name
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      textAlign="right"
                      py={5}
                      pr={20}
                      fontWeight="700"
                      fontSize="md"
                      color="gray.700"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {isLoading
                    ? Array.from({ length: itemsPerPage }).map((_, i) => (
                        <Table.Row key={`skeleton-${i}`}>
                          <Table.Cell
                            textAlign="center"
                            borderRight="1px"
                            borderColor="gray.100"
                            py={5}
                          >
                            <Skeleton height="18px" mx="auto" width="30px" />
                          </Table.Cell>
                          <Table.Cell
                            textAlign="center"
                            borderRight="1px"
                            borderColor="gray.100"
                            py={5}
                          >
                            <Skeleton height="18px" mx="auto" width="160px" />
                          </Table.Cell>
                          <Table.Cell py={5} pr={4}>
                            <HStack spacing={4} justify="flex-end">
                              <Skeleton
                                height="28px"
                                width="60px"
                                borderRadius="lg"
                              />
                              <Skeleton
                                height="28px"
                                width="60px"
                                borderRadius="lg"
                              />
                              <Skeleton
                                height="28px"
                                width="70px"
                                borderRadius="lg"
                              />
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    : paginatedFamilies.map((family, index) => {
                        const isRowLoading = false;
                        return (
                          <Table.Row
                            key={family.id}
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.2s"
                            opacity={isRowLoading ? 0.7 : 1}
                          >
                            <Table.Cell
                              textAlign="center"
                              borderRight="1px"
                              borderColor="gray.100"
                              py={5}
                              fontSize="md"
                              color="gray.600"
                            >
                              {indexOfFirstItem + index + 1}
                            </Table.Cell>
                            <Table.Cell
                              textAlign="center"
                              borderRight="1px"
                              borderColor="gray.100"
                              py={5}
                              fontSize="md"
                              fontWeight="600"
                              color="gray.800"
                            >
                              {family.family_name}
                            </Table.Cell>
                            <Table.Cell py={1} pr={4}>
                              <HStack spacing={4} justify="flex-end">
                                <Button
                                  size="xs"
                                  variant="outline"
                                  borderColor="#003399"
                                  color="#003399"
                                  borderRadius="lg"
                                  borderWidth="2px"
                                  fontWeight="800"
                                  px={3}
                                  py={1}
                                  onClick={() => handleEdit(family)}
                                  _hover={{
                                    bg: "#003399",
                                    color: "white",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0 4px 12px rgba(68, 44, 162, 0.3)",
                                  }}
                                  _active={{ transform: "translateY(0)" }}
                                  transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                  gap={2}
                                >
                                  <Icon as={LuPencil} fontSize="14px" />
                                  EDIT
                                </Button>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  borderColor="#d32f2f"
                                  color="#d32f2f"
                                  borderRadius="lg"
                                  borderWidth="2px"
                                  fontWeight="800"
                                  px={3}
                                  py={1}
                                  onClick={() => handleDelete(family.id)}
                                  _hover={{
                                    bg: "#d32f2f",
                                    color: "white",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0 4px 12px rgba(211, 47, 47, 0.3)",
                                  }}
                                  _active={{ transform: "translateY(0)" }}
                                  transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                  gap={2}
                                >
                                  <Icon as={LuTrash2} fontSize="14px" />
                                  DELETE
                                </Button>
                              </HStack>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                  {!isLoading && families.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={3} textAlign="center" py={12}>
                        <VStack spacing={2}>
                          <Text color="gray.400" fontSize="lg">
                            No families found.
                          </Text>
                          <Button
                            variant="link"
                            color={primaryMaroon}
                            onClick={handleAddNew}
                          >
                            Add your first family
                          </Button>
                        </VStack>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Pagination Info */}
            <Flex justify="space-between" align="center" mt={8}>
              <Text fontSize="sm" color="gray.500" fontWeight="500">
                Showing {families.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
                {Math.min(indexOfLastItem, families.length)} of{" "}
                {families.length} entries
              </Text>
              <HStack spacing={2}>
                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="full"
                  px={4}
                  borderColor="gray.200"
                  color="gray.600"
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  _hover={{ bg: "gray.50" }}
                >
                  Previous
                </Button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <Text
                      key={`ellipsis-${idx}`}
                      px={1}
                      fontSize="sm"
                      color="gray.400"
                      userSelect="none"
                      alignSelf="center"
                    >
                      …
                    </Text>
                  ) : (
                    <Button
                      key={page}
                      bg={currentPage === page ? primaryMaroon : "transparent"}
                      color={currentPage === page ? "white" : "gray.600"}
                      variant={currentPage === page ? "solid" : "ghost"}
                      size="sm"
                      borderRadius="full"
                      w="36px"
                      onClick={() => handlePageChange(page)}
                      _hover={{
                        bg: currentPage === page ? "#6b0f1a" : "gray.100",
                      }}
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="full"
                  px={4}
                  borderColor="gray.200"
                  color="gray.600"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages || totalPages === 0}
                  _hover={{ bg: "gray.50" }}
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

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <Footer />
    </Box>
  );
};

export default FamilyPage;
