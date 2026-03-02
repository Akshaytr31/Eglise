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
  SimpleGrid,
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

    const hasFile = fields.some((f) => f.type === "file" && formData[f.name]);

    if (hasFile) {
      const fd = new FormData();
      fields.forEach((f) => {
        if (isEditing && f.disabledOnEdit) return;

        let val = formData[f.name];
        if (val !== undefined && val !== "") {
          if (f.coerce) val = f.coerce(val);
          fd.append(f.name, val);
        }
      });
      onSave(fd);
    } else {
      const coerced = Object.fromEntries(
        fields
          .filter((f) => !(isEditing && f.disabledOnEdit))
          .map((f) => {
            let val = formData[f.name];
            if (val === "" || val === undefined) return [f.name, undefined];
            if (f.coerce) val = f.coerce(val);
            return [f.name, val];
          })
          .filter(([name, value]) => value !== undefined),
      );
      onSave(coerced);
    }
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
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {fields.map((f) => {
                  const hasValue = String(formData[f.name] || "").length > 0;
                  const isFocused = focusedField === f.name;
                  const shouldFloat =
                    isFocused || hasValue || f.type === "select";

                  return (
                    <Box
                      key={f.name}
                      w="full"
                      position="relative"
                      gridColumn={f.fullWidth ? "span 2" : "auto"}
                    >
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
                          disabled={isEditing && f.disabledOnEdit}
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
                      ) : f.type === "select" ? (
                        <Box
                          as="select"
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(f.name)}
                          onBlur={() => setFocusedField(null)}
                          required={f.required}
                          disabled={isEditing && f.disabledOnEdit}
                          style={{
                            width: "100%",
                            height: "38px",
                            borderRadius: "8px",
                            borderColor: "var(--chakra-colors-gray-200)",
                            borderWidth: "1px",
                            fontSize: "var(--chakra-fontSizes-xs)",
                            paddingLeft: "8px",
                            appearance: "none",
                            background: "white",
                          }}
                        >
                          <option value="">Select {f.label}</option>
                          {f.options?.map((opt, i) => {
                            const isObj =
                              typeof opt === "object" && opt !== null;
                            const val = isObj ? opt.value : opt;
                            const lbl = isObj ? opt.label : opt;
                            return (
                              <option key={i} value={val}>
                                {lbl}
                              </option>
                            );
                          })}
                        </Box>
                      ) : (
                        <Input
                          name={f.name}
                          type={f.type || "text"}
                          value={
                            f.type === "file" ? undefined : formData[f.name]
                          }
                          onChange={(e) => {
                            if (f.type === "file") {
                              setFormData((prev) => ({
                                ...prev,
                                [f.name]: e.target.files[0],
                              }));
                            } else {
                              handleChange(e);
                            }
                          }}
                          onFocus={() => setFocusedField(f.name)}
                          onBlur={() => setFocusedField(null)}
                          required={f.required}
                          disabled={isEditing && f.disabledOnEdit}
                          borderRadius="8px"
                          borderColor="gray.200"
                          h="38px"
                          fontSize="xs"
                          pt={f.type === "file" ? "6px" : "auto"}
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
              </SimpleGrid>
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
