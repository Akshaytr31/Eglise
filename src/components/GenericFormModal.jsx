import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Button,
  Text,
  Flex,
  Input,
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
import { LuSave, LuX } from "react-icons/lu";

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

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="lg"
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DialogPositioner pt="80px" alignItems="flex-start">
        <DialogContent borderRadius="20px" overflow="hidden" boxShadow="2xl">
          <DialogHeader
            bg={primaryMaroon}
            color="white"
            fontSize="lg"
            py={4}
            px={8}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="relative"
            borderBottom="1px solid rgba(255,255,255,0.1)"
          >
            <Text fontWeight="600" letterSpacing="0.5px">
              {itemData
                ? `EDIT ${title.toUpperCase()}`
                : `ADD NEW ${title.toUpperCase()}`}
            </Text>
            <DialogCloseTrigger
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              color="white"
              bg="whiteAlpha.200"
              borderRadius="full"
              _hover={{ bg: "whiteAlpha.400" }}
              p={1.5}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={LuX} fontSize="18px" />
            </DialogCloseTrigger>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody py={10} px={10} bg="white">
              <VStack spacing={6} align="start">
                {fields.map((f) => (
                  <Box key={f.name} w="full">
                    <Flex align="center">
                      <Text
                        fontWeight="600"
                        minW="150px"
                        fontSize="lg"
                        color="gray.700"
                      >
                        {f.label}:
                      </Text>
                      <Input
                        name={f.name}
                        type={f.type || "text"}
                        value={formData[f.name]}
                        onChange={handleChange}
                        required={f.required}
                        borderRadius="xl"
                        borderColor="gray.200"
                        h="54px"
                        fontSize="lg"
                        _focus={fieldFocus}
                      />
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </DialogBody>

            <DialogFooter
              px={10}
              pb={8}
              pt={0}
              bg="white"
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                type="submit"
                bg={primaryMaroon}
                color="white"
                borderRadius="full"
                h="50px"
                px={10}
                fontSize="lg"
                fontWeight="bold"
                _hover={{
                  bg: "#6b0f1a",
                  boxShadow: "lg",
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "translateY(0)" }}
                isLoading={isLoading}
                display="flex"
                alignItems="center"
                gap={2}
                transition="all 0.2s"
              >
                <Icon as={LuSave} fontSize="22px" />
                SAVE CHANGES
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default GenericFormModal;
