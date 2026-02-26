import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Table,
  Text,
  Flex,
  Input,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

/**
 * RegistryTable — a reusable CRUD table page component.
 *
 * Props:
 *  - title         {string}    Page/section heading. e.g. "Family Directory"
 *  - addLabel      {string}    Add button text. e.g. "Add New Family"
 *  - nameKey       {string}    Key in each item object that holds the display name. e.g. "family_name"
 *  - columnLabel   {string}    Column header label for the name column. e.g. "Family Name"
 *  - emptyMessage  {string}    Message shown when list is empty.
 *  - listFn        {function}  Async fn: ()           => response with response.data array
 *  - createFn      {function}  Async fn: (formData)   => creates item
 *  - updateFn      {function}  Async fn: (id, formData) => updates item
 *  - deleteFn      {function}  Async fn: (id)         => deletes item
 *  - FormModal     {component} Modal component; receives { isOpen, onClose, onSave, itemData, isLoading }
 *  - itemsPerPage  {number}    Rows per page. Default: 7
 */
const RegistryTable = ({
  title = "Directory",
  addLabel = "Add New",
  nameKey = "name",
  columnLabel = "Name",
  emptyMessage = "No records found.",
  dataPropName = "itemData",
  listFn,
  createFn,
  updateFn,
  deleteFn,
  FormModal,
  itemsPerPage = 7,
}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const primaryMaroon = "var(--primary-maroon)";

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await listFn();
      setItems(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsLoading(true);
    try {
      if (selectedItem) {
        await updateFn(selectedItem.id, formData);
      } else {
        await createFn(formData);
      }
      fetchItems();
      onClose();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFn(itemToDelete);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    onOpen();
  };

  // Pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
      pages.push(i);
    }
    if (right < totalPages - 1) pages.push("...");
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
              {title}
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
              {addLabel}
            </Button>
          </Flex>

          {/* Table Container */}
          <Box p={8}>
            <Flex justify="flex-end" mb={6} align="center" gap={3}>
              <Text fontWeight="600" fontSize="md" color="gray.600">
                Search:
              </Text>
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
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
                      {columnLabel}
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
                                width="70px"
                                borderRadius="lg"
                              />
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    : paginatedItems.map((item, index) => (
                        <Table.Row
                          key={item.id}
                          _hover={{ bg: "gray.50" }}
                          transition="background 0.2s"
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
                            {item[nameKey]}
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
                                onClick={() => handleEdit(item)}
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
                                onClick={() => handleDelete(item.id)}
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
                      ))}

                  {!isLoading && items.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={3} textAlign="center" py={12}>
                        <VStack spacing={2}>
                          <Text color="gray.400" fontSize="lg">
                            {emptyMessage}
                          </Text>
                          <Button
                            variant="link"
                            color={primaryMaroon}
                            onClick={handleAddNew}
                          >
                            Add your first entry
                          </Button>
                        </VStack>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Pagination */}
            <Flex justify="space-between" align="center" mt={8}>
              <Text fontSize="sm" color="gray.500" fontWeight="500">
                Showing {items.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
                {Math.min(indexOfLastItem, items.length)} of {items.length}{" "}
                entries
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

      {FormModal && (
        <FormModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleCreateOrUpdate}
          {...{ [dataPropName]: selectedItem }}
          isLoading={isLoading}
        />
      )}

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

export default RegistryTable;
