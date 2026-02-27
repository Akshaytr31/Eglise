import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Button,
  Text,
  Flex,
  Input,
  Textarea,
  Icon,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogCloseTrigger,
  DialogPositioner,
} from "@chakra-ui/react";
import { LuSave, LuPlus, LuX } from "react-icons/lu";

/**
 * GenericFormModal — reusable add/edit modal driven by a field config array.
 *
 * Props:
 *  - isOpen    {boolean}
 *  - onClose   {function}
 *  - onSave    {function}  called with the coerced form values
 *  - itemData  {object}    existing item for editing, null for adding
 *  - isLoading {boolean}
 *  - title     {string}    used in the header, e.g. "Ward"
 *  - fields    {Array}     [{ name, label, type?, required?, coerce? }]
 *                            type:   html input type (default "text")
 *                            coerce: fn applied before saving (e.g. Number)
 */
const GenericFormModal = ({
  isOpen,
  onClose,
  onSave,
  itemData,
  isLoading,
  fields = [],
  title = "",
}) => {
  const primaryMaroon = "var(--primary-maroon)";
  const buildEmpty = () => Object.fromEntries(fields.map((f) => [f.name, ""]));

  const [formData, setFormData] = useState(buildEmpty);

  useEffect(() => {
    if (itemData) {
      setFormData(
        Object.fromEntries(fields.map((f) => [f.name, itemData[f.name] ?? ""])),
      );
    } else {
      setFormData(buildEmpty());
    }
  }, [itemData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const coerced = Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.coerce ? f.coerce(formData[f.name]) : formData[f.name],
      ]),
    );
    onSave(coerced);
  };

  const fieldFocus = {
    borderColor: primaryMaroon,
    boxShadow: `0 0 0 1px ${primaryMaroon}`,
  };

  const isEditing = Boolean(itemData);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="sm"
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DialogPositioner alignItems="center">
        <DialogContent borderRadius="14px" overflow="hidden" boxShadow="2xl">
          <DialogHeader
            bg={primaryMaroon}
            color="white"
            fontSize="sm"
            py={3}
            px={5}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="relative"
            borderBottom="1px solid rgba(255,255,255,0.1)"
          >
            <Text fontWeight="600" letterSpacing="0.5px" fontSize="sm">
              {isEditing
                ? `EDIT ${title.toUpperCase()}`
                : `ADD NEW ${title.toUpperCase()}`}
            </Text>
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
              <Icon as={LuX} fontSize="14px" />
            </DialogCloseTrigger>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody py={5} px={6} bg="white">
              <VStack spacing={5} align="start">
                {fields.map((f) => (
                  <Box key={f.name} w="full">
                    <Flex align="center" gap={5}>
                      <Text
                        fontWeight="600"
                        minW="110px"
                        fontSize="xs"
                        color="gray.700"
                      >
                        {f.label}:
                      </Text>
                      {f.type === "textarea" ? (
                        <Textarea
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          required={f.required}
                          rows={f.rows || 3}
                          borderRadius="md"
                          borderColor="gray.200"
                          fontSize="xs"
                          _focus={fieldFocus}
                        />
                      ) : (
                        <Input
                          name={f.name}
                          type={f.type || "text"}
                          value={formData[f.name]}
                          onChange={handleChange}
                          required={f.required}
                          borderRadius="md"
                          borderColor="gray.200"
                          h="28px"
                          fontSize="xs"
                          _focus={fieldFocus}
                        />
                      )}
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </DialogBody>

            <DialogFooter
              px={6}
              pb={5}
              pt={2}
              bg="white"
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                type="submit"
                bg={primaryMaroon}
                color="white"
                borderRadius="lg"
                h="30px"
                px={2}
                fontSize="xs"
                fontWeight="bold"
                _hover={{
                  bg: "#6b0f1a",
                  boxShadow: "md",
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "translateY(0)" }}
                loading={isLoading}
                display="flex"
                alignItems="center"
                gap={1.5}
                transition="all 0.2s"
              >
                <Icon as={isEditing ? LuSave : LuPlus} fontSize="10px" />
                {isEditing ? "Save Changes" : "Add New"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default GenericFormModal;
