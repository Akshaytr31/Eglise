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
import {
  LuSave,
  LuPlus,
  LuX,
  LuUpload,
  LuImage,
  LuTrash2,
} from "react-icons/lu";

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
  const columnCount = fields.length > 6 ? 3 : 2;

  const [formData, setFormData] = useState(buildEmpty);
  const [focusedField, setFocusedField] = useState(null);
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    // Cleanup previews on unmount
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (itemData) {
      setFormData(
        Object.fromEntries(fields.map((f) => [f.name, itemData[f.name] ?? ""])),
      );
      // If there's an existing image URL, we could show it, but for now we focus on new uploads
      setPreviews({});
    } else {
      setFormData(buildEmpty());
      setPreviews({});
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
      size={fields.length > 6 ? "xl" : "md"}
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DialogPositioner alignItems="center">
        <DialogContent
          borderRadius="14px"
          overflow="hidden"
          boxShadow="2xl"
          maxH="95vh"
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
            <Text fontWeight="600" letterSpacing="0.5px" fontSize="md">
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
              <Icon as={LuX} fontSize="18px" />
            </DialogCloseTrigger>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
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
                  background: "rgba(233, 227, 227, 0.1)",
                  borderRadius: "10px",
                },
              }}
            >
              <SimpleGrid columns={{ base: 1, md: columnCount }} gap={5}>
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
                      gridColumn={f.fullWidth ? `span ${columnCount}` : "auto"}
                    >
                      {/* Floating Label */}
                      {f.type !== "file" && (
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
                          fontSize={shouldFloat ? "sm" : "sm"}
                          fontWeight={shouldFloat ? "700" : "500"}
                          pointerEvents="none"
                          letterSpacing="0.3px"
                        >
                          {f.label}
                        </Text>
                      )}

                      {f.type === "file" ? (
                        <VStack
                          spacing={3}
                          align="center"
                          w="full"
                          gridColumn={
                            f.fullWidth ? `span ${columnCount}` : "auto"
                          }
                        >
                          <Box
                            w="full"
                            minH="200px"
                            borderRadius="12px"
                            border="2px dashed"
                            borderColor={
                              previews[f.name] ? primaryMaroon : "gray.200"
                            }
                            bg={previews[f.name] ? "gray.900" : "gray.50"}
                            transition="all 0.3s"
                            _hover={{
                              borderColor: primaryMaroon,
                              bg: previews[f.name]
                                ? "gray.900"
                                : "rgba(123, 13, 30, 0.05)",
                            }}
                            position="relative"
                            overflow="hidden"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() =>
                              document.getElementById(`file-${f.name}`).click()
                            }
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const file = e.dataTransfer.files[0];
                              if (file && file.type.startsWith("image/")) {
                                const url = URL.createObjectURL(file);
                                setPreviews((prev) => ({
                                  ...prev,
                                  [f.name]: url,
                                }));
                                setFormData((prev) => ({
                                  ...prev,
                                  [f.name]: file,
                                }));
                              }
                            }}
                          >
                            {previews[f.name] ? (
                              <Box position="relative" w="full" h="full">
                                <Box
                                  as="img"
                                  src={previews[f.name]}
                                  alt="Preview"
                                  w="full"
                                  h="200px"
                                  objectFit="cover"
                                />
                                <Box
                                  position="absolute"
                                  top={0}
                                  left={0}
                                  right={0}
                                  bottom={0}
                                  bg="blackAlpha.400"
                                  opacity={0}
                                  _hover={{ opacity: 1 }}
                                  transition="opacity 0.2s"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <VStack spacing={2}>
                                    <Icon
                                      as={LuUpload}
                                      color="white"
                                      fontSize="24px"
                                    />
                                    <Text
                                      color="white"
                                      fontSize="xs"
                                      fontWeight="bold"
                                    >
                                      Change Image
                                    </Text>
                                  </VStack>
                                </Box>
                                <Button
                                  size="xs"
                                  position="absolute"
                                  top={2}
                                  right={2}
                                  bg="white"
                                  color="red.500"
                                  borderRadius="full"
                                  boxShadow="md"
                                  _hover={{ bg: "red.50" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    URL.revokeObjectURL(previews[f.name]);
                                    setPreviews((prev) => {
                                      const next = { ...prev };
                                      delete next[f.name];
                                      return next;
                                    });
                                    setFormData((prev) => ({
                                      ...prev,
                                      [f.name]: null,
                                    }));
                                  }}
                                >
                                  <Icon as={LuTrash2} />
                                </Button>
                              </Box>
                            ) : (
                              <VStack spacing={3} py={6}>
                                <Box
                                  p={4}
                                  borderRadius="full"
                                  bg="rgba(123, 13, 30, 0.08)"
                                  color={primaryMaroon}
                                >
                                  <Icon as={LuImage} fontSize="32px" />
                                </Box>
                                <VStack spacing={1}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.700"
                                  >
                                    Click to upload Family Photo
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    or drag and drop
                                  </Text>
                                  <Text fontSize="10px" color="gray.400">
                                    PNG, JPG or WEBP (Max 5MB)
                                  </Text>
                                </VStack>
                              </VStack>
                            )}
                            <input
                              id={`file-${f.name}`}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setPreviews((prev) => ({
                                    ...prev,
                                    [f.name]: url,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    [f.name]: file,
                                  }));
                                }
                              }}
                            />
                          </Box>
                        </VStack>
                      ) : f.type === "textarea" ? (
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
                          fontSize="sm"
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
                            fontSize: "var(--chakra-fontSizes-sm)",
                            paddingLeft: "12px",
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
                          fontSize="sm"
                          pt={f.type === "file" ? "10px" : "auto"}
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
              px={8}
              pb={6}
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
                h="40px"
                px={4}
                fontSize="md"
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
                <Icon as={isEditing ? LuSave : LuPlus} fontSize="14px" />
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
