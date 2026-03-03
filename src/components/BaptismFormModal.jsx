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
import {
  listFamilies,
  listMembers,
  listRelationships,
} from "../api/registryServices";

const BaptismFormModal = ({ isOpen, onClose, onSave, itemData, isLoading }) => {
  const primaryMaroon = "var(--primary-maroon)";

  const [formData, setFormData] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Options states
  const [families, setFamilies] = useState([]);
  const [members, setMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [fRes, mRes, rRes] = await Promise.all([
          listFamilies(),
          listMembers(),
          listRelationships(),
        ]);
        setFamilies(fRes.data || []);
        setMembers(mRes.data || []);
        setRelationships(rRes.data || []);
      } catch (error) {
        console.error("Error fetching baptism form options:", error);
      }
    };
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (itemData) {
      setFormData(itemData);
    } else {
      setFormData({
        baptism_category: "PARISH",
        gender: "MALE",
        date_of_baptism: "",
        register_number: "",
        place_of_birth: "",
        name: "",
        baptismal_name: "",
        dob: "",
        address: "",
        parish_of_baptism: "",
        god_father: "",
        god_mother: "",
        father_name: "",
        mother_name: "",
        remarks: "",
        family: "",
        main_member: "",
        relation_with_main_member: "",
      });
    }
  }, [itemData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Process and coerce
    const submissionData = { ...formData };

    // Coerce numbers if present
    if (submissionData.family)
      submissionData.family = Number(submissionData.family);
    if (submissionData.main_member)
      submissionData.main_member = Number(submissionData.main_member);
    if (submissionData.relation_with_main_member)
      submissionData.relation_with_main_member = Number(
        submissionData.relation_with_main_member,
      );

    // Clean up if category is OTHER
    if (submissionData.baptism_category === "OTHER") {
      delete submissionData.family;
      delete submissionData.main_member;
      delete submissionData.relation_with_main_member;
    }

    onSave(submissionData);
  };

  const isEditing = Boolean(itemData);
  const isParish = formData.baptism_category === "PARISH";

  const renderField = (
    name,
    label,
    type = "text",
    options = null,
    fullWidth = false,
  ) => {
    const hasValue = String(formData[name] || "").length > 0;
    const isFocused = focusedField === name;
    const shouldFloat =
      isFocused || hasValue || type === "select" || type === "date";

    return (
      <Box
        key={name}
        w="full"
        position="relative"
        gridColumn={fullWidth ? "span 2" : "auto"}
      >
        <Text
          as="label"
          position="absolute"
          left={shouldFloat ? "10px" : "12px"}
          top={shouldFloat ? "0" : "50%"}
          transform={
            shouldFloat ? "translateY(-50%) scale(0.85)" : "translateY(-50%)"
          }
          transformOrigin="left top"
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          color={isFocused ? primaryMaroon : "gray.500"}
          bg="white"
          px={1}
          zIndex={2}
          fontSize="xs"
          fontWeight={shouldFloat ? "700" : "500"}
          pointerEvents="none"
          letterSpacing="0.3px"
        >
          {label}
        </Text>

        {type === "select" ? (
          <Box
            as="select"
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
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
            <option value="">Select {label}</option>
            {options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Box>
        ) : type === "textarea" ? (
          <Textarea
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            rows={3}
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
            name={name}
            type={type}
            value={formData[name] || ""}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
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
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="md"
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
          >
            <Text fontWeight="600" letterSpacing="0.5px">
              {isEditing ? "EDIT BAPTISM RECORD" : "ADD BAPTISM RECORD"}
            </Text>
            <DialogCloseTrigger color="white" />
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody py={6} px={6} bg="white">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {renderField("baptism_category", "Baptism Category", "select", [
                  { value: "PARISH", label: "Parish" },
                  { value: "OTHER", label: "Other" },
                ])}
                {renderField("register_number", "Register Number")}
                {renderField("date_of_baptism", "Date of Baptism", "date")}
                {renderField("dob", "Date of Birth", "date")}
                {renderField("name", "Name", "text", null, true)}
                {renderField("baptismal_name", "Baptismal Name")}
                {renderField("gender", "Gender", "select", [
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ])}
                {renderField("place_of_birth", "Place of Birth")}
                {renderField("parish_of_baptism", "Parish of Baptism")}
                {renderField("god_father", "God Father")}
                {renderField("god_mother", "God Mother")}
                {renderField("father_name", "Father Name")}
                {renderField("mother_name", "Mother Name")}

                {isParish && (
                  <>
                    <Box
                      gridColumn="span 2"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      my={1}
                    />
                    <Text
                      gridColumn="span 2"
                      fontSize="xs"
                      fontWeight="bold"
                      color={primaryMaroon}
                    >
                      Parish Details
                    </Text>
                    {renderField(
                      "family",
                      "Family",
                      "select",
                      families.map((f) => ({
                        value: f.id,
                        label: f.family_name,
                      })),
                    )}
                    {renderField(
                      "main_member",
                      "Main Member",
                      "select",
                      members.map((m) => ({ value: m.id, label: m.name })),
                    )}
                    {renderField(
                      "relation_with_main_member",
                      "Relationship",
                      "select",
                      relationships.map((r) => ({
                        value: r.id,
                        label: r.relation_name,
                      })),
                    )}
                  </>
                )}

                {renderField("address", "Address", "textarea", null, true)}
                {renderField("remarks", "Remarks", "textarea", null, true)}
              </SimpleGrid>
            </DialogBody>

            <DialogFooter px={6} pb={5} pt={2} bg="white">
              <Button
                type="submit"
                bg={primaryMaroon}
                color="white"
                borderRadius="lg"
                loading={isLoading}
                _hover={{ bg: "#6b0f1a" }}
              >
                <Icon as={isEditing ? LuSave : LuPlus} mr={2} />
                {isEditing ? "Save Changes" : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default BaptismFormModal;
