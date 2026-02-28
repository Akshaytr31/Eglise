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
  const [focusedField, setFocusedField] = useState(null);

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
            <DialogBody py={6} px={6} bg="white">
              <VStack spacing={6} gap={3} align="start">
                {fields.map((f) => {
                  const hasValue = String(formData[f.name] || "").length > 0;
                  const isFocused = focusedField === f.name;
                  const shouldFloat = isFocused || hasValue;

                  return (
                    <Box key={f.name} w="full" position="relative">
                      {/* Floating Label */}
                      <Text
                        as="label"
                        position="absolute"
                        left={shouldFloat ? "10px" : "12px"}
                        top={shouldFloat ? "0" : "50%"}
                        transform={
                          shouldFloat
                            ? "translateY(-50%) scale(0.85)"
                            : "translateY(-50%)"
                        }
                        transformOrigin="left top"
                        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        color={isFocused ? primaryMaroon : "gray.500"}
                        bg="white"
                        px={1}
                        zIndex={2}
                        fontSize={shouldFloat ? "xs" : "xs"}
                        fontWeight={shouldFloat ? "700" : "500"}
                        pointerEvents="none"
                        letterSpacing="0.3px"
                      >
                        {f.label}
                      </Text>

                      {f.type === "textarea" ? (
                        <Textarea
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(f.name)}
                          onBlur={() => setFocusedField(null)}
                          required={f.required}
                          rows={f.rows || 3}
                          borderRadius="8px"
                          borderColor="gray.200"
                          fontSize="xs"
                          pt={3}
                          _focus={{
                            borderColor: primaryMaroon,
                            boxShadow: "none",
                            borderWidth: "1px",
                          }}
                        />
                      ) : (
                        <Input
                          name={f.name}
                          type={f.type || "text"}
                          value={formData[f.name]}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(f.name)}
                          onBlur={() => setFocusedField(null)}
                          required={f.required}
                          borderRadius="8px"
                          borderColor="gray.200"
                          h="38px"
                          fontSize="xs"
                          _focus={{
                            borderColor: primaryMaroon,
                            boxShadow: "none",
                            borderWidth: "1px",
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
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
                fontSize="sm"
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
                {isEditing ? "Save Changes" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default GenericFormModal;
