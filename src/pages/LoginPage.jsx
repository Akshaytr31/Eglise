import React, { useState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  VStack,
  Text,
  Image,
  Flex,
  Link,
  Icon,
  HStack,
} from "@chakra-ui/react";
import {
  LuCircleUser,
  LuLock,
  LuShieldCheck,
  LuScale,
  LuCircleHelp,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import authService from "../auth/authService";
import loginIllustration from "../assets/133748214_10221134.jpg";

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (email) {
      setStep(2);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.login({ email, password });
      navigate("/");
    } catch (err) {
      console.error("Login failed full error:", err);
      const backendError = err.response?.data;
      let errorMessage = "Invalid email or password";

      if (backendError) {
        if (typeof backendError === "string") {
          errorMessage = backendError;
        } else if (backendError.detail) {
          errorMessage = backendError.detail;
        } else if (backendError.error) {
          errorMessage = backendError.error;
        } else if (backendError.non_field_errors) {
          errorMessage = Array.isArray(backendError.non_field_errors)
            ? backendError.non_field_errors[0]
            : backendError.non_field_errors;
        } else if (typeof backendError === "object") {
          // If it's a field-specific error, show the first one
          const firstField = Object.keys(backendError)[0];
          const errorValue = backendError[firstField];
          errorMessage = `${firstField}: ${Array.isArray(errorValue) ? errorValue[0] : errorValue}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryMaroon = "var(--primary-maroon)";
  const white = "var(--white)";
  const lightGray = "var(--light-gray)";

  const stepVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 50,
    }),
  };

  return (
    <Box bg={white} minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <Flex
        flex="1"
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        px={8}
        py={12}
      >
        {/* Left Side: Illustration */}
        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={loginIllustration}
            alt="Login Illustration"
            maxW={{ base: "300px", md: "500px" }}
            opacity={0.9}
          />
        </Box>

        {/* Right Side: Form */}
        <Box flex="1" maxW="400px" w="full" px={4} overflow="hidden">
          <VStack align="start" spacing={8} w="full">
            <Box>
              <Heading as="h2" size="xl" fontWeight="semibold" mb={2}>
                Welcome to Eglise
              </Heading>
            </Box>

            {error && (
              <Box
                p={3}
                bg="red.50"
                color="red.500"
                borderRadius="md"
                w="full"
                textAlign="center"
                border="1px solid"
                borderColor="red.200"
              >
                <Text fontSize="sm">{error}</Text>
              </Box>
            )}

            <Box w="full" position="relative">
              <form
                style={{ width: "100%" }}
                onSubmit={step === 1 ? handleNext : handleLogin}
              >
                <AnimatePresence mode="wait" custom={step}>
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      custom={1}
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <VStack spacing={6} align="start" w="full">
                        <Field.Root w="full">
                          <Field.Label fontWeight="medium" mb={2}>
                            Enter Email Address
                          </Field.Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=""
                            required
                            size="lg"
                            borderRadius="md"
                            borderColor="gray.400"
                            _focus={{
                              borderColor: primaryMaroon,
                              boxShadow: "none",
                            }}
                          />
                        </Field.Root>

                        <Button
                          type="submit"
                          w="full"
                          bg={primaryMaroon}
                          color={white}
                          size="lg"
                          borderRadius="md"
                          _hover={{ bg: "#901a42" }}
                          isLoading={isLoading}
                          fontSize="lg"
                        >
                          Continue
                        </Button>
                      </VStack>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      custom={-1}
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <VStack spacing={6} align="start" w="full">
                        {/* Registered Email Display */}
                        <HStack spacing={3} w="full" py={2}>
                          <Icon
                            as={LuCircleUser}
                            color={primaryMaroon}
                            boxSize={6}
                          />
                          <Text fontWeight="semibold" fontSize="md">
                            {email}
                          </Text>
                          <Button
                            variant="ghost"
                            size="xs"
                            color={primaryMaroon}
                            onClick={() => setStep(1)}
                            _hover={{
                              bg: "transparent",
                              textDecoration: "underline",
                            }}
                          >
                            Change
                          </Button>
                        </HStack>

                        <Text fontSize="sm" color="gray.600">
                          Please enter your registered password
                        </Text>

                        <Field.Root w="full">
                          <Field.Label fontWeight="bold" mb={1}>
                            Password
                          </Field.Label>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            size="lg"
                            borderRadius="md"
                            borderColor="gray.400"
                            _focus={{
                              borderColor: primaryMaroon,
                              boxShadow: "none",
                            }}
                            autoFocus
                          />
                        </Field.Root>

                        <Flex w="full" justify="space-between" align="center">
                          <HStack spacing={2}>
                            <input
                              type="checkbox"
                              style={{ accentColor: primaryMaroon }}
                            />
                            <Text fontSize="sm" fontWeight="medium">
                              Remember me
                            </Text>
                          </HStack>
                          <Link
                            fontSize="sm"
                            fontWeight="semibold"
                            color={primaryMaroon}
                            _hover={{ textDecoration: "underline" }}
                          >
                            Forgot Password
                          </Link>
                        </Flex>

                        <Button
                          type="submit"
                          w="full"
                          bg={primaryMaroon}
                          color={white}
                          size="lg"
                          borderRadius="md"
                          _hover={{ bg: "#901a42" }}
                          isLoading={isLoading}
                          fontSize="lg"
                        >
                          Log in
                        </Button>

                        {/* Secondary Links */}
                        <HStack justify="center" w="full" spacing={6} pt={4}>
                          <HStack
                            spacing={1}
                            color="gray.600"
                            cursor="pointer"
                            _hover={{ color: primaryMaroon }}
                          >
                            <Text fontSize="xs" fontWeight="medium">
                              Privacy
                            </Text>
                            <Icon as={LuShieldCheck} boxSize={3} />
                          </HStack>
                          <HStack
                            spacing={1}
                            color="gray.600"
                            cursor="pointer"
                            _hover={{ color: primaryMaroon }}
                          >
                            <Text fontSize="xs" fontWeight="medium">
                              Terms
                            </Text>
                            <Icon as={LuScale} boxSize={3} />
                          </HStack>
                          <HStack
                            spacing={1}
                            color="gray.600"
                            cursor="pointer"
                            _hover={{ color: primaryMaroon }}
                          >
                            <Text fontSize="xs" fontWeight="medium">
                              FAQ
                            </Text>
                            <Icon as={LuCircleHelp} boxSize={3} />
                          </HStack>
                        </HStack>
                      </VStack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Box>
          </VStack>
        </Box>
      </Flex>

      {/* Footer Restored */}
      <Box py={4} px={8} borderTop="1px solid" borderColor="gray.100">
        <Flex justify="space-between" color={lightGray} fontSize="xs">
          <Text>V 1.0.1</Text>
          <Text>
            Copyright © 2024 Appzia Tec Solutions. All rights reserved.
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default LoginPage;
