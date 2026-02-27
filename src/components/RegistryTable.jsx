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
import GenericFormModal from "./GenericFormModal";

/**
 * RegistryTable — a reusable CRUD table page component.
 *
 * Props:
 *  - title         {string}    Page/section heading. e.g. "Ward Directory"
 *  - addLabel      {string}    Add button text. e.g. "Add New Ward"
 *  - nameKey       {string}    Key in each item object for the display name. e.g. "ward_name"
 *  - columnLabel   {string}    Column header label. e.g. "Ward Name"
 *  - emptyMessage  {string}    Message shown when list is empty.
 *  - dataPropName  {string}    The prop name FormModal expects for item data. Default: "itemData"
 *  - listFn        {function}  Async fn: ()             => response with response.data array
 *  - createFn      {function}  Async fn: (formData)     => creates item
 *  - updateFn      {function}  Async fn: (id, formData) => updates item
 *  - deleteFn      {function}  Async fn: (id)           => deletes item
 *  - FormModal     {component} Custom modal (for complex forms like Family). Mutually exclusive with `fields`.
 *  - fields        {Array}     Simple field definitions for the built-in GenericFormModal:
 *                              [{ name, label, type?, required?, coerce? }]
 *                              Use this instead of FormModal for simple forms.
 *  - itemsPerPage  {number}    Rows per page. Default: 10
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
  fields,
  itemsPerPage = 10,
}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const primaryMaroon = "var(--primary-maroon)";
  // Alternating column backgrounds

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

  // Search filter
  const filteredItems = searchQuery.trim()
    ? items.filter((item) =>
        String(item[nameKey] ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : items;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Pagination (based on filtered results)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

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

      <Container maxW="container.xl" flex="1" py={5}>
        <Box
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
          bg="white"
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            px={5}
            py={3}
            pb={0}
            borderBottom="2px"
            borderColor={primaryMaroon}
            bg="white"
          >
            <Heading
              size="md"
              color={primaryMaroon}
              fontWeight="700"
              letterSpacing="tight"
            >
              {title}
            </Heading>
            <Button
              bg={primaryMaroon}
              color="white"
              px={3}
              h="36px"
              borderRadius="md"
              fontWeight="bold"
              fontSize="sm"
              _hover={{
                bg: "#6b0f1a",
                transform: "translateY(-1px)",
                boxShadow: "md",
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={handleAddNew}
              display="flex"
              alignItems="center"
              gap={1.5}
              transition="all 0.2s"
            >
              <Icon as={LuPlus} fontSize="15px" />
              {addLabel}
            </Button>
          </Flex>

          {/* Table Container */}
          <Box px={5} py={4}>
            <Flex justify="flex-end" mb={3} align="center" gap={2}>
              <Text fontWeight="600" fontSize="xs" color="gray.500">
                Search:
              </Text>
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                maxW="240px"
                size="sm"
                borderRadius="md"
                borderColor="gray.200"
                fontSize="xs"
                value={searchQuery}
                onChange={handleSearchChange}
                _focus={{
                  borderColor: primaryMaroon,
                  boxShadow: `0 0 0 1px ${primaryMaroon}`,
                }}
              />
            </Flex>

            <Box
              border="1px"
              borderColor="gray.200"
              borderRadius="lg"
              overflowX="auto"
              overflow="hidden"
            >
              <Table.Root variant="line" size="sm">
                <Table.Header>
                  <Table.Row borderBottom="2px" borderColor="gray.200">
                    <Table.ColumnHeader
                      textAlign="center"
                      borderRight="1px"
                      borderColor="gray.200"
                      py={0}
                      px={4}
                      fontWeight="700"
                      fontSize="xs"
                      color="gray.600"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      w="80px"
                    >
                      SI No
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      textAlign="center"
                      borderRight="1px"
                      borderColor="gray.200"
                      py={2.5}
                      px={4}
                      fontWeight="700"
                      fontSize="xs"
                      color="gray.600"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      {columnLabel}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      textAlign="right"
                      py={2.5}
                      pr={6}
                      pl={4}
                      fontWeight="700"
                      fontSize="xs"
                      color="gray.600"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      w="180px"
                    >
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {isLoading
                    ? Array.from({ length: itemsPerPage }).map((_, i) => (
                        <Table.Row
                          key={`skeleton-${i}`}
                          bg={i % 2 === 0 ? "gray.100" : "white"}
                        >
                          <Table.Cell
                            textAlign="center"
                            borderRight="1px"
                            borderColor="gray.200"
                            py={2.5}
                            px={4}
                          >
                            <Skeleton
                              height="14px"
                              mx="auto"
                              width="24px"
                              borderRadius="sm"
                            />
                          </Table.Cell>
                          <Table.Cell
                            textAlign="center"
                            borderRight="1px"
                            borderColor="gray.200"
                            py={2.5}
                            px={4}
                          >
                            <Skeleton
                              height="14px"
                              mx="auto"
                              width="140px"
                              borderRadius="sm"
                            />
                          </Table.Cell>
                          <Table.Cell py={2.5} pr={6} pl={4}>
                            <HStack spacing={2} justify="flex-end">
                              <Skeleton
                                height="22px"
                                width="50px"
                                borderRadius="md"
                              />
                              <Skeleton
                                height="22px"
                                width="58px"
                                borderRadius="md"
                              />
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    : paginatedItems.map((item, index) => (
                        <Table.Row
                          key={item.id}
                          bg={index % 2 === 0 ? "gray.100" : "white"}
                          _hover={{
                            transform: "scale(1.01)",
                            zIndex: 1,
                            boxShadow: "sm",
                          }}
                          transition="transform 0.2s ease, box-shadow 0.2s ease"
                          position="relative"
                        >
                          <Table.Cell
                            textAlign="center"
                            borderRight="1px"
                            borderColor="gray.200"
                            py={0}
                            px={4}
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="600"
                          >
                            {indexOfFirstItem + index + 1}
                          </Table.Cell>
                          <Table.Cell
                            textAlign="center"
                            borderRight="1px"
                            borderColor="gray.200"
                            py={0}
                            px={4}
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.800"
                          >
                            {item[nameKey]}
                          </Table.Cell>
                          <Table.Cell py={0} pr={4} pl={4}>
                            <HStack spacing={2} justify="flex-end">
                              {/* Edit Ghost Button */}
                              <Box
                                as="button"
                                onClick={() => handleEdit(item)}
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                w="28px"
                                h="28px"
                                borderRadius="full"
                                color="blue.500"
                                bg="transparent"
                                border="1.5px solid transparent"
                                transition="all 0.25s cubic-bezier(0.4,0,0.2,1)"
                                _hover={{
                                  color: "#003399",
                                  transform: "translateY(-2px) scale(1.15)",
                                  //   boxShadow: "0 4px 14px rgba(0,51,153,0.2)",
                                }}
                                _active={{
                                  transform: "translateY(0) scale(0.95)",
                                  boxShadow: "none",
                                }}
                                title="Edit"
                              >
                                <Icon as={LuPencil} fontSize="13px" />
                              </Box>

                              {/* Delete Ghost Button */}
                              <Box
                                as="button"
                                onClick={() => handleDelete(item.id)}
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                w="28px"
                                h="28px"
                                borderRadius="full"
                                color="red.400"
                                bg="transparent"
                                border="1.5px solid transparent"
                                transition="all 0.25s cubic-bezier(0.4,0,0.2,1)"
                                _hover={{
                                  // bg: "rgba(211, 47, 47, 0.08)",
                                  // border: "1.5px solid rgba(211,47,47,0.3)",
                                  color: "#d32f2f",
                                  transform: "translateY(-2px) scale(1.15)",
                                }}
                                _active={{
                                  transform: "translateY(0) scale(0.95)",
                                  boxShadow: "none",
                                }}
                                title="Delete"
                              >
                                <Icon as={LuTrash2} fontSize="13px" />
                              </Box>
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      ))}

                  {!isLoading && filteredItems.length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={3} textAlign="center" py={10}>
                        <VStack spacing={1.5}>
                          <Text color="gray.400" fontSize="sm">
                            {searchQuery.trim()
                              ? `No results for "${searchQuery}".`
                              : emptyMessage}
                          </Text>
                          {!searchQuery.trim() && (
                            <Button
                              variant="link"
                              color={primaryMaroon}
                              fontSize="sm"
                              onClick={handleAddNew}
                            >
                              Add your first entry
                            </Button>
                          )}
                        </VStack>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Pagination */}
            <Flex justify="space-between" align="center" mt={4}>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                Showing {filteredItems.length > 0 ? indexOfFirstItem + 1 : 0}–
                {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
                {filteredItems.length}
                {searchQuery.trim() && items.length !== filteredItems.length
                  ? ` (filtered from ${items.length})`
                  : " entries"}
              </Text>
              <HStack spacing={1}>
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="full"
                  px={3}
                  borderColor="gray.200"
                  color="gray.500"
                  fontSize="xs"
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
                      fontSize="xs"
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
                      color={currentPage === page ? "white" : "gray.500"}
                      variant={currentPage === page ? "solid" : "ghost"}
                      size="xs"
                      borderRadius="full"
                      w="28px"
                      fontSize="xs"
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
                  size="xs"
                  borderRadius="full"
                  px={3}
                  borderColor="gray.200"
                  color="gray.500"
                  fontSize="xs"
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

      {fields && !FormModal ? (
        <GenericFormModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleCreateOrUpdate}
          itemData={selectedItem}
          isLoading={isLoading}
          fields={fields}
          title={title.replace(/ Directory| Page/i, "").trim()}
        />
      ) : FormModal ? (
        <FormModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleCreateOrUpdate}
          {...{ [dataPropName]: selectedItem }}
          isLoading={isLoading}
        />
      ) : null}

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        entityName={title.replace(/\s*(Directory|Page)\s*/i, "").trim()}
      />

      <Footer />
    </Box>
  );
};

export default RegistryTable;
