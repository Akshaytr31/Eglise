import React, { useState, useEffect } from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogCloseTrigger,
  DialogPositioner,
  Button,
  VStack,
  Text,
  Input,
  Textarea,
  Box,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { LuSave, LuX } from "react-icons/lu";

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
              {familyData ? "EDIT FAMILY" : "ADD NEW FAMILY"}
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
                <Box w="full">
                  <Flex align="center">
                    <Text
                      fontWeight="600"
                      minW="140px"
                      fontSize="lg"
                      color="gray.700"
                    >
                      Family Name:
                    </Text>
                    <Input
                      name="family_name"
                      value={formData.family_name}
                      onChange={handleChange}
                      required
                      borderRadius="xl"
                      borderColor="gray.200"
                      h="54px"
                      fontSize="lg"
                      _focus={{
                        borderColor: primaryMaroon,
                        boxShadow: `0 0 0 1px ${primaryMaroon}`,
                      }}
                    />
                  </Flex>
                </Box>

                <Box w="full">
                  <Flex align="center">
                    <Text
                      fontWeight="600"
                      minW="140px"
                      fontSize="lg"
                      color="gray.700"
                    >
                      Origin:
                    </Text>
                    <Input
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      borderRadius="xl"
                      borderColor="gray.200"
                      h="54px"
                      fontSize="lg"
                      _focus={{
                        borderColor: primaryMaroon,
                        boxShadow: `0 0 0 1px ${primaryMaroon}`,
                      }}
                    />
                  </Flex>
                </Box>

                <Box w="full">
                  <Flex align="start">
                    <Text
                      fontWeight="600"
                      minW="140px"
                      fontSize="lg"
                      color="gray.700"
                      pt={2}
                    >
                      History:
                    </Text>
                    <Textarea
                      name="history"
                      value={formData.history}
                      onChange={handleChange}
                      rows={4}
                      borderRadius="xl"
                      borderColor="gray.200"
                      fontSize="lg"
                      _focus={{
                        borderColor: primaryMaroon,
                        boxShadow: `0 0 0 1px ${primaryMaroon}`,
                      }}
                    />
                  </Flex>
                </Box>
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

export default FamilyFormModal;
