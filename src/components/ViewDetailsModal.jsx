import React from "react";
import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  SimpleGrid,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogPositioner,
  Button,
} from "@chakra-ui/react";
import { LuX, LuEye } from "react-icons/lu";

const ViewDetailsModal = ({ isOpen, onClose, itemData, title, fields }) => {
  const primaryMaroon = "var(--primary-maroon)";

  if (!itemData) return null;

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return `${baseUrl.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const renderValue = (value, field = {}) => {
    if (value === null || value === undefined || value === "") return "—";

    // Handle objects (like family or priest objects)
    if (typeof value === "object") {
      // Common name keys in this project
      return (
        value.name ||
        value.family_name ||
        value.designation_name ||
        JSON.stringify(value)
      );
    }

    return String(value);
  };

  // Determine which fields to show. Use 'fields' prop if provided (and it's an array), otherwise show all keys in itemData
  const displayFields = Array.isArray(fields)
    ? fields.map((f) => ({ label: f.label, key: f.name, type: f.type }))
    : Object.keys(itemData)
        .filter((key) => !["id", "created_at", "updated_at"].includes(key))
        .map((key) => ({
          label: key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          key: key,
        }));

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="xl"
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DialogPositioner alignItems="center">
        <DialogContent
          borderRadius="14px"
          overflow="hidden"
          boxShadow="2xl"
          maxH="90vh"
          display="flex"
          flexDirection="column"
        >
          <DialogHeader
            bg={primaryMaroon}
            color="white"
            fontSize="md"
            py={4}
            px={8}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="relative"
            borderBottom="1px solid rgba(255,255,255,0.1)"
          >
            <Flex align="center" gap={2}>
              <Icon as={LuEye} fontSize="18px" />
              <Text
                fontWeight="600"
                letterSpacing="0.5px"
                fontSize="md"
                textTransform="uppercase"
              >
                View Details: {title}
              </Text>
            </Flex>
            <DialogCloseTrigger
              position="absolute"
              right={3}
              top="50%"
              transform="translateY(-50%)"
              color="white"
              bg="whiteAlpha.200"
              borderRadius="full"
              _hover={{ bg: "whiteAlpha.400" }}
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={LuX} fontSize="18px" />
            </DialogCloseTrigger>
          </DialogHeader>

          <DialogBody
            py={8}
            px={8}
            bg="white"
            flex="1"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,0.1)",
                borderRadius: "10px",
              },
            }}
          >
            {/* Image Section if applicable */}
            {(() => {
              const imageField = displayFields.find(
                (f) =>
                  f.key.toLowerCase().includes("image") ||
                  f.key.toLowerCase().includes("photo"),
              );
              if (!imageField || !itemData[imageField.key]) return null;

              return (
                <Box mb={8} textAlign="center">
                  <Box
                    as="img"
                    src={getFullImageUrl(itemData[imageField.key])}
                    alt={imageField.label}
                    maxH="300px"
                    mx="auto"
                    borderRadius="lg"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                  />
                  <Text mt={2} fontSize="xs" color="gray.500" fontWeight="bold">
                    {imageField.label}
                  </Text>
                </Box>
              );
            })()}

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              {displayFields
                .filter(
                  (f) =>
                    !f.key.toLowerCase().includes("image") &&
                    !f.key.toLowerCase().includes("photo"),
                )
                .map((field, idx) => (
                  <VStack
                    key={idx}
                    align="start"
                    spacing={1}
                    p={3}
                    borderRadius="md"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Text
                      fontSize="10px"
                      fontWeight="800"
                      color="gray.400"
                      textTransform="uppercase"
                      letterSpacing="0.05em"
                    >
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                      {renderValue(itemData[field.key], field)}
                    </Text>
                  </VStack>
                ))}
            </SimpleGrid>
          </DialogBody>

          <DialogFooter
            px={8}
            py={4}
            bg="gray.50"
            borderTop="1px solid"
            borderColor="gray.100"
          >
            <Button
              onClick={onClose}
              bg="gray.500"
              color="white"
              borderRadius="lg"
              h="36px"
              px={6}
              fontSize="sm"
              fontWeight="bold"
              _hover={{ bg: "gray.600" }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default ViewDetailsModal;
