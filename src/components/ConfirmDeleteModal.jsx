import React from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogPositioner,
  Button,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { LuTriangleAlert, LuTrash2 } from "react-icons/lu";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  entityName = "Record",
}) => {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="sm"
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DialogPositioner alignItems="center">
        <DialogContent borderRadius="20px" overflow="hidden" boxShadow="2xl">
          {/* Icon banner */}
          <Flex justify="center" align="center" pt={8} pb={4} bg="white">
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg="red.50"
              align="center"
              justify="center"
            >
              <Icon as={LuTriangleAlert} fontSize="30px" color="red.500" />
            </Flex>
          </Flex>

          <DialogHeader
            bg="white"
            textAlign="center"
            fontSize="xl"
            fontWeight="700"
            color="gray.800"
            pb={2}
            pt={0}
          >
            Delete {entityName}?
          </DialogHeader>

          <DialogBody bg="white" textAlign="center" px={8} pb={6}>
            <Text color="gray.500" fontSize="md">
              This action cannot be undone. The {entityName.toLowerCase()}{" "}
              record will be permanently removed.
            </Text>
          </DialogBody>

          <DialogFooter
            bg="white"
            px={8}
            pb={8}
            pt={0}
            display="flex"
            gap={3}
            justifyContent="center"
          >
            <Button
              variant="outline"
              borderRadius="full"
              h="44px"
              px={8}
              fontWeight="600"
              borderColor="gray.200"
              color="gray.600"
              _hover={{ bg: "gray.50" }}
              onClick={onClose}
              flex={1}
            >
              Cancel
            </Button>
            <Button
              borderRadius="full"
              h="44px"
              px={8}
              fontWeight="700"
              bg="var(--primary-maroon)"
              color="white"
              _hover={{
                bg: "var(--primary-maroon)",
                transform: "translateY(-1px)",
                boxShadow: "md",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              isLoading={isLoading}
              onClick={onConfirm}
              flex={1}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={LuTrash2} fontSize="16px" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default ConfirmDeleteModal;
