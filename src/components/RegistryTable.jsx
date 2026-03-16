import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Text,
  Flex,
  Input,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuSearch,
} from "react-icons/lu";
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
  itemsPerPage = 12,
  extraActions = [], // Array of { label, icon, onClick, color, title }
  columns = [], // Array of { header, key, textAlign }
}) => {
  const navigate = useNavigate();
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
    console.log(
      "Submitting form data:",
      formData instanceof FormData ? "FormData object" : formData,
    );
    if (formData instanceof FormData) {
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
    }
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
      let serverMsg = error.message;

      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          // Format Django REST framework style errors: { field: [msg], ... }
          serverMsg = Object.entries(error.response.data)
            .map(([field, msgs]) => {
              const messages = Array.isArray(msgs) ? msgs.join(" ") : msgs;
              return `${field}: ${messages}`;
            })
            .join("\n");
        } else {
          serverMsg = JSON.stringify(error.response.data, null, 2);
        }
      }

      console.log("Formatted server error message:", serverMsg);
      const status = error.response?.status ? `(${error.response.status})` : "";
      alert(`Error saving item ${status}:\n${serverMsg}`);
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
            py={2}
            pb={0}
            borderBottom="2px"
            borderColor={primaryMaroon}
            bg="white"
          >
            <HStack spacing={3} align="center">
              <Box
                as="button"
                onClick={() => navigate(-1)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="28px"
                h="28px"
                borderRadius="full"
                border="1px solid"
                borderColor="rgba(123,13,30,0.2)"
                bg={primaryMaroon}
                color="white"
                transition="all 0.2s"
                _hover={{
                  transform: "translateX(-2px)",
                  color: { primaryMaroon },
                }}
                _active={{ transform: "translateX(0)" }}
                title="Go Back"
                mr={1}
              >
                <Icon as={LuChevronLeft} fontSize="16px" />
              </Box>

              {/* Gradient accent bar */}
              <Box
                w="4px"
                h="26px"
                borderRadius="full"
                bg="linear-gradient(180deg, #9b1b30 0%, #6b0f1a 100%)"
                flexShrink={0}
              />

              <Box>
                <Heading
                  size="md"
                  fontWeight="800"
                  letterSpacing="tight"
                  lineHeight="1"
                  style={{
                    background:
                      "linear-gradient(135deg, #7b0d1e 30%, #c0392b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {title}
                </Heading>
              </Box>
              {/* Live count chip */}
              <Box
                px={2}
                py="1px"
                borderRadius="full"
                bg="rgba(123,13,30,0.08)"
                border="1px solid rgba(123,13,30,0.15)"
              >
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  color={primaryMaroon}
                  lineHeight="1.6"
                >
                  {filteredItems.length}
                </Text>
              </Box>
            </HStack>
            <HStack
              flex="1"
              justify="flex-end"
              px={4}
              maxW="450px"
              role="group"
            >
              <Box position="relative" w="full">
                <Input
                  placeholder={`Search ${title.toLowerCase()}...`}
                  size="sm"
                  borderRadius="lg"
                  bg="rgba(174,32,80,0.03)"
                  borderWidth="1px"
                  borderColor="rgba(174,32,80,0.1)"
                  fontSize="xs"
                  pl={10}
                  h="34px"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  _placeholder={{ color: "gray.400", fontSize: "xs" }}
                  _focus={{
                    bg: "white",
                    borderColor: primaryMaroon,
                  }}
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                />
                <Box
                  position="absolute"
                  left={3.5}
                  top="45%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  pointerEvents="none"
                  transition="all 0.2s"
                  _groupFocusWithin={{
                    color: primaryMaroon,
                    transform: "translateY(-50%) scale(1.1)",
                  }}
                >
                  <Icon as={LuSearch} fontSize="14px" />
                </Box>
              </Box>
            </HStack>
            <Button
              bg={primaryMaroon}
              color="white"
              px={2}
              py={1}
              h="30px"
              borderRadius="md"
              fontWeight="bold"
              fontSize="xs"
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
              <Icon as={LuPlus} fontSize="16px" />
              {addLabel}
            </Button>
          </Flex>

          {/* Card Grid Container */}
          <Box px={5} py={6}>
            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <Box
                    key={`skeleton-${i}`}
                    p={5}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    bg="white"
                    boxShadow="sm"
                  >
                    <VStack align="start" spacing={3}>
                      <HStack w="full" justify="space-between">
                        <Skeleton height="20px" width="60%" borderRadius="md" />
                        <Skeleton
                          height="16px"
                          width="30px"
                          borderRadius="full"
                        />
                      </HStack>
                      <Skeleton height="14px" width="40%" borderRadius="md" />
                      <Box w="full" h="1px" bg="gray.50" my={1} />
                      <HStack w="full" justify="flex-end" spacing={2}>
                        <Skeleton
                          height="28px"
                          width="28px"
                          borderRadius="full"
                        />
                        <Skeleton
                          height="28px"
                          width="28px"
                          borderRadius="full"
                        />
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : filteredItems.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={4}>
                {paginatedItems.map((item, index) => (
                  <Box
                    key={item.id}
                    position="relative"
                    borderRadius="lg"
                    overflow="hidden"
                    bg="white"
                    borderWidth="1px"
                    borderColor="purple.100"
                    boxShadow="0 2px 12px -5px rgba(0,0,0,0.05), 0 1px 4px -5px rgba(0,0,0,0.02)"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 15px 30px -10px rgba(123, 13, 30, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.03)",
                      borderColor: "rgba(13, 11, 11, 0.1)",
                    }}
                  >
                    {/* Compact Card Header (No Avatar) */}
                    <Box p={3} pb={1}>
                      <Flex align="center" justify="space-between" mb={2}>
                        <HStack
                          align="start"
                          spacing={0}
                          w="full"
                          justify="space-between"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="800"
                            color="gray.800"
                            letterSpacing="tight"
                            lineHeight="1.1"
                            noOfLines={1}
                          >
                            {item[nameKey]}
                          </Text>
                          <Text
                            fontSize="8px"
                            fontWeight="700"
                            color="gray.400"
                            textTransform="uppercase"
                            letterSpacing="widest"
                            mt={0.5}
                          >
                            {title.replace(/ Directory| Page/i, "").trim()} #
                            {indexOfFirstItem + index + 1}
                          </Text>
                        </HStack>
                      </Flex>

                      {/* Detail Rows */}
                      <HStack align="start" spacing={2} w="full" px={0.5}>
                        {columns
                          .filter((col) => col.key !== nameKey)
                          .map((col, idx) => (
                            <HStack key={`card-field-compact-${idx}`} w="full">
                              <Box w="100%">
                                <Text
                                  fontSize="7px"
                                  fontWeight="800"
                                  color="gray.400"
                                  textTransform="uppercase"
                                  letterSpacing="wider"
                                  mb={-0.5}
                                >
                                  {col.header}
                                </Text>
                                <Text
                                  fontSize="9px"
                                  fontWeight="700"
                                  color="gray.600"
                                  noOfLines={1}
                                  lineHeight="1.2"
                                >
                                  {item[col.key] || "—"}
                                </Text>
                              </Box>
                            </HStack>
                          ))}
                      </HStack>
                    </Box>

                    {/* Compact Action Bar */}
                    <Box mt={2} bg="gray.50" px={4} py={1.5}>
                      <Flex justify="space-between" align="center">
                        <HStack spacing={1.5}>
                          {extraActions.map((action, idx) => {
                            if (action.showIf && !action.showIf(item))
                              return null;
                            return (
                              <Box
                                key={`extra-action-compact-${idx}`}
                                as="button"
                                onClick={() => action.onClick(item)}
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                w="24px"
                                h="24px"
                                borderRadius="full"
                                color={action.color || "gray.600"}
                                bg="white"
                                boxShadow="xs"
                                border="1px solid"
                                borderColor="gray.100"
                                transition="all 0.2s"
                                _hover={{
                                  transform: "translateY(-1px)",
                                  color: "white",
                                  bg: action.color || primaryMaroon,
                                  boxShadow: "sm",
                                  border: "none",
                                }}
                                title={action.title}
                              >
                                <Icon as={action.icon} fontSize="12px" />
                              </Box>
                            );
                          })}
                        </HStack>

                        <HStack spacing={2}>
                          <Box
                            as="button"
                            onClick={() => handleEdit(item)}
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            w="26px"
                            h="26px"
                            borderRadius="full"
                            color="blue.500"
                            bg="white"
                            boxShadow="xs"
                            border="1px solid"
                            borderColor="blue.50"
                            transition="all 0.2s"
                            _hover={{
                              transform: "translateY(-1px)",
                              color: "white",
                              bg: "blue.500",
                              boxShadow: "0 3px 8px rgba(49, 130, 206, 0.2)",
                              border: "none",
                            }}
                            title="Edit"
                          >
                            <Icon as={LuPencil} fontSize="12px" />
                          </Box>

                          <Box
                            as="button"
                            onClick={() => handleDelete(item.id)}
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            w="26px"
                            h="26px"
                            borderRadius="full"
                            color="red.500"
                            bg="white"
                            boxShadow="xs"
                            border="1px solid"
                            borderColor="red.50"
                            transition="all 0.2s"
                            _hover={{
                              transform: "translateY(-1px)",
                              color: "white",
                              bg: "red.500",
                              boxShadow: "0 3px 8px rgba(229, 62, 62, 0.2)",
                              border: "none",
                            }}
                            title="Delete"
                          >
                            <Icon as={LuTrash2} fontSize="12px" />
                          </Box>
                        </HStack>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={20} bg="gray.50" borderRadius="xl">
                <VStack spacing={3}>
                  <Text color="gray.400" fontSize="md" fontWeight="500">
                    {searchQuery.trim()
                      ? `No results for "${searchQuery}".`
                      : emptyMessage}
                  </Text>
                  {!searchQuery.trim() && (
                    <Button
                      variant="solid"
                      bg={primaryMaroon}
                      color="white"
                      size="sm"
                      onClick={handleAddNew}
                      _hover={{ bg: "#6b0f1a" }}
                    >
                      Add your first entry
                    </Button>
                  )}
                </VStack>
              </Box>
            )}

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
                {/* Go to First Page */}
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="full"
                  w="28px"
                  h="24px"
                  minW="unset"
                  px={0}
                  borderColor="gray.200"
                  color="gray.500"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  _hover={{ bg: "gray.50", color: "gray.700" }}
                  title="First page"
                >
                  <Icon as={LuChevronsLeft} fontSize="13px" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="full"
                  w="28px"
                  h="24px"
                  minW="unset"
                  px={0}
                  borderColor="gray.200"
                  color="gray.500"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  _hover={{ bg: "gray.50", color: "gray.700" }}
                  title="Previous page"
                >
                  <Icon as={LuChevronLeft} fontSize="13px" />
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
                      borderRadius="lg"
                      w="28px"
                      h="24px"
                      minW="unset"
                      px={0}
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

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="full"
                  w="28px"
                  h="24px"
                  minW="unset"
                  px={0}
                  borderColor="gray.200"
                  color="gray.500"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  _hover={{ bg: "gray.50", color: "gray.700" }}
                  title="Next page"
                >
                  <Icon as={LuChevronRight} fontSize="13px" />
                </Button>

                {/* Go to Last Page */}
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="full"
                  w="28px"
                  h="24px"
                  minW="unset"
                  px={0}
                  borderColor="gray.200"
                  color="gray.500"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  _hover={{ bg: "gray.50", color: "gray.700" }}
                  title="Last page"
                >
                  <Icon as={LuChevronsRight} fontSize="13px" />
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
