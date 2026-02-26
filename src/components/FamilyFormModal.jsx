import React, { useState, useEffect } from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogCloseTrigger,
  Button,
  VStack,
  Text,
  Input,
  Textarea,
  Box,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { LuSave } from "react-icons/lu";

const FamilyFormModal = ({
  isOpen,
  onClose,
  onSave,
  familyData,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    family_name: "",
    origin: "",
    history: "",
  });

  const primaryMaroon = "var(--primary-maroon)";

  useEffect(() => {
    if (familyData) {
      setFormData({
        family_name: familyData.family_name || "",
        origin: familyData.origin || "",
        history: familyData.history || "",
      });
    } else {
      setFormData({
        family_name: "",
        origin: "",
        history: "",
      });
    }
  }, [familyData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="lg"
    >
      <DialogBackdrop bg="blackAlpha.300" backdropFilter="blur(2px)" />
      <DialogContent borderRadius="15px" overflow="hidden" boxShadow="2xl">
        <DialogHeader
          bg="#1a365d"
          color="white"
          fontSize="lg"
          py={3}
          px={6}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontWeight="bold" letterSpacing="wide">
            {familyData ? "EDIT FAMILY" : "ADD NEW FAMILY"}
          </Text>
          <DialogCloseTrigger
            position="relative"
            right={0}
            top={0}
            color="white"
          />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody py={8} px={10}>
            <VStack spacing={6} align="start">
              <Box w="full">
                <Flex align="center" mb={2}>
                  <Text fontWeight="medium" minW="120px">
                    Family Name:
                  </Text>
                  <Input
                    name="family_name"
                    value={formData.family_name}
                    onChange={handleChange}
                    placeholder=""
                    required
                    borderRadius="10px"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#1a365d",
                      boxShadow: "0 0 0 1px #1a365d",
                    }}
                  />
                </Flex>
              </Box>

              <Box w="full">
                <Flex align="center" mb={2}>
                  <Text fontWeight="medium" minW="120px">
                    Origin:
                  </Text>
                  <Input
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder=""
                    borderRadius="10px"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#1a365d",
                      boxShadow: "0 0 0 1px #1a365d",
                    }}
                  />
                </Flex>
              </Box>

              <Box w="full">
                <Flex align="start" mb={2}>
                  <Text fontWeight="medium" minW="120px" pt={2}>
                    History:
                  </Text>
                  <Textarea
                    name="history"
                    value={formData.history}
                    onChange={handleChange}
                    placeholder=""
                    rows={5}
                    borderRadius="10px"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#1a365d",
                      boxShadow: "0 0 0 1px #1a365d",
                    }}
                  />
                </Flex>
              </Box>
            </VStack>
          </DialogBody>

          <DialogFooter
            px={10}
            pb={6}
            pt={0}
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              type="submit"
              bg="#1a365d"
              color="white"
              borderRadius="10px"
              px={8}
              _hover={{ bg: "#0d1b2e" }}
              isLoading={isLoading}
            >
              <Icon as={LuSave} mr={2} />
              SAVE
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

export default FamilyFormModal;
