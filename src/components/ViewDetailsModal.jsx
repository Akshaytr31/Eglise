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
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogPositioner,
  Button,
  HStack,
  Separator,
} from "@chakra-ui/react";
import {
  LuX,
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuChurch,
  LuCalendar,
  LuInfo,
  LuGraduationCap,
  LuBriefcase,
  LuHeart,
} from "react-icons/lu";

const SectionHeader = ({ icon, title, primaryMaroon }) => (
  <HStack spacing={2} mb={4} mt={6} align="center">
    <Box
      p={1.5}
      bg="rgba(123, 13, 30, 0.08)"
      borderRadius="lg"
      color={primaryMaroon}
    >
      <Icon as={icon} fontSize="16px" />
    </Box>
    <Text
      fontSize="xs"
      fontWeight="800"
      color={primaryMaroon}
      textTransform="uppercase"
      letterSpacing="0.1em"
    >
      {title}
    </Text>
    <Separator flex="1" borderColor="gray.100" />
  </HStack>
);

const DetailField = ({ label, value, icon }) => (
  <VStack
    align="start"
    spacing={1}
    p={3}
    borderRadius="xl"
    bg="gray.50"
    border="1px solid"
    borderColor="gray.100"
    transition="all 0.2s"
    _hover={{
      bg: "white",
      borderColor: "rgba(123, 13, 30, 0.2)",
      boxShadow: "sm",
    }}
  >
    <HStack spacing={1.5} color="gray.400">
      {icon && <Icon as={icon} fontSize="10px" />}
      <Text
        fontSize="10px"
        fontWeight="800"
        textTransform="uppercase"
        letterSpacing="0.05em"
      >
        {label}
      </Text>
    </HStack>
    <Text fontSize="sm" fontWeight="600" color="gray.700" noOfLines={2}>
      {value}
    </Text>
  </VStack>
);

const ViewDetailsModal = ({ isOpen, onClose, itemData, title, fields }) => {
  const primaryMaroon = "var(--primary-maroon)";

  if (!itemData) return null;

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return `${baseUrl.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") {
      return (
        value.name ||
        value.family_name ||
        value.ward_name ||
        value.designation_name ||
        JSON.stringify(value)
      );
    }
    return String(value);
  };

  // Categories mapping
  const personalKeys = [
    "gender",
    "dob",
    "blood_group",
    "marital_status",
    "spouse_name",
    "father_name",
    "mother_name",
  ];
  const churchKeys = [
    "baptismal_name",
    "date_of_baptism",
    "parish_of_baptism",
    "ward",
    "family",
    "grade",
    "joining_date",
    "sunday_school_qualification",
    "transferred_from",
  ];
  const contactKeys = ["email", "mobile_no", "phone_no", "address"];
  const miscKeys = ["educational_qualification", "profession"];

  const getIconForKey = (key) => {
    if (key.includes("email")) return LuMail;
    if (key.includes("mobile") || key.includes("phone")) return LuPhone;
    if (key.includes("date") || key.includes("dob") || key.includes("joining"))
      return LuCalendar;
    if (
      key.includes("parish") ||
      key.includes("church") ||
      key.includes("ward") ||
      key.includes("family")
    )
      return LuChurch;
    if (key.includes("address")) return LuMapPin;
    if (key.includes("qualification")) return LuGraduationCap;
    if (key.includes("profession")) return LuBriefcase;
    if (
      key.includes("blood") ||
      key.includes("marital") ||
      key.includes("spouse")
    )
      return LuHeart;
    return LuInfo;
  };

  const displayFields = Array.isArray(fields)
    ? fields.map((f) => ({ label: f.label, key: f.name }))
    : Object.keys(itemData)
        .filter(
          (key) =>
            !["id", "created_at", "updated_at", "family_image"].includes(key),
        )
        .map((key) => ({
          label: key
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          key: key,
        }));

  const imageKey =
    displayFields.find(
      (f) =>
        f.key.toLowerCase().includes("image") ||
        f.key.toLowerCase().includes("photo"),
    )?.key || "family_image";
  const profileImage = itemData[imageKey];
  const mainName = itemData.name || itemData.family_name || title;

  // Filter fields into groups and check if they have content
  const personalFields = displayFields.filter(
    (f) =>
      personalKeys.includes(f.key) ||
      (miscKeys.includes(f.key) && !churchKeys.includes(f.key)),
  );
  const churchFields = displayFields.filter((f) => churchKeys.includes(f.key));
  const contactFields = displayFields.filter((f) =>
    contactKeys.includes(f.key),
  );

  const handledKeys = [
    ...personalKeys,
    ...churchKeys,
    ...contactKeys,
    ...miscKeys,
    imageKey,
  ];
  const unhandledFields = displayFields.filter(
    (f) => !handledKeys.includes(f.key),
  );

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="xl"
    >
      <DialogBackdrop bg="blackAlpha.700" backdropFilter="blur(8px)" />
      <DialogPositioner alignItems="center">
        <DialogContent
          borderRadius="24px"
          overflow="hidden"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          maxH="90vh"
          display="flex"
          flexDirection="column"
          border="none"
        >
          <DialogCloseTrigger
            position="absolute"
            right={4}
            top={4}
            color="white"
            bg="whiteAlpha.300"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.400" }}
            p={2}
            zIndex={10}
          >
            <Icon as={LuX} fontSize="20px" />
          </DialogCloseTrigger>

          <DialogBody
            p={0}
            bg="white"
            flex="1"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "gray.50" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(123, 13, 30, 0.2)",
                borderRadius: "10px",
              },
            }}
          >
            {/* Hero Banner Area */}
            <Box
              h={profileImage ? "140px" : "100px"}
              bgGradient={`linear(to-br, ${primaryMaroon}, #9b1b30)`}
              position="relative"
              w="full"
            />

            {/* Profile Summary Header */}
            <Flex
              direction="column"
              align="center"
              mt={profileImage ? "-60px" : "-30px"}
              px={8}
              pb={6}
              borderBottom="1px solid"
              borderColor="gray.50"
              position="relative"
            >
              {profileImage && (
                <Box
                  p={1}
                  bg="white"
                  borderRadius="3xl"
                  boxShadow="xl"
                  position="relative"
                  mb={4}
                >
                  <Box
                    as="img"
                    src={getFullImageUrl(profileImage)}
                    w="120px"
                    h="120px"
                    borderRadius="2xl"
                    objectFit="cover"
                  />
                </Box>
              )}

              <VStack mt={profileImage ? 0 : 4} spacing={0} textAlign="center">
                <Text
                  fontSize="2xl"
                  fontWeight="800"
                  color="gray.800"
                  letterSpacing="tight"
                >
                  {mainName}
                </Text>
                <HStack color="gray.500" spacing={2} justify="center">
                  {itemData.baptismal_name && (
                    <Text fontSize="sm" fontWeight="600">
                      {itemData.baptismal_name}
                    </Text>
                  )}
                  {itemData.baptismal_name && itemData.house_name && (
                    <Text opacity={0.3}>•</Text>
                  )}
                  {itemData.house_name && (
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.05em"
                    >
                      {itemData.house_name}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </Flex>

            {/* Content Sections */}
            <Box px={10} pb={12}>
              {/* Personal Info Section */}
              {personalFields.length > 0 && (
                <>
                  <SectionHeader
                    icon={LuUser}
                    title="Personal Information"
                    primaryMaroon={primaryMaroon}
                  />
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    {personalFields.map((f, idx) => (
                      <DetailField
                        key={idx}
                        label={f.label}
                        value={renderValue(itemData[f.key])}
                        icon={getIconForKey(f.key)}
                      />
                    ))}
                  </SimpleGrid>
                </>
              )}

              {/* Church Info Section */}
              {churchFields.length > 0 && (
                <>
                  <SectionHeader
                    icon={LuChurch}
                    title="Church & Parish Data"
                    primaryMaroon={primaryMaroon}
                  />
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    {churchFields.map((f, idx) => (
                      <DetailField
                        key={idx}
                        label={f.label}
                        value={renderValue(itemData[f.key])}
                        icon={getIconForKey(f.key)}
                      />
                    ))}
                  </SimpleGrid>
                </>
              )}

              {/* Contact Info Section */}
              {contactFields.length > 0 && (
                <>
                  <SectionHeader
                    icon={LuMail}
                    title="Contact Details"
                    primaryMaroon={primaryMaroon}
                  />
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {contactFields.map((f, idx) => (
                      <DetailField
                        key={idx}
                        label={f.label}
                        value={renderValue(itemData[f.key])}
                        icon={getIconForKey(f.key)}
                      />
                    ))}
                  </SimpleGrid>
                </>
              )}

              {/* Remaining Fields (Catch-all) */}
              {unhandledFields.length > 0 && (
                <>
                  <SectionHeader
                    icon={LuInfo}
                    title="Other Details"
                    primaryMaroon={primaryMaroon}
                  />
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    {unhandledFields.map((f, idx) => (
                      <DetailField
                        key={idx}
                        label={f.label}
                        value={renderValue(itemData[f.key])}
                        icon={getIconForKey(f.key)}
                      />
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Box>
          </DialogBody>

          <DialogFooter
            p={6}
            bg="gray.50"
            borderTop="1px solid"
            borderColor="gray.100"
            justifyContent="center"
          >
            <Button
              onClick={onClose}
              bg={primaryMaroon}
              color="white"
              borderRadius="xl"
              h="45px"
              px={12}
              fontSize="md"
              fontWeight="bold"
              _hover={{
                bg: "#6b0f1a",
                transform: "translateY(-1px)",
                boxShadow: "lg",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              Done Viewing
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default ViewDetailsModal;
