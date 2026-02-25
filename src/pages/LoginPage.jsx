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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import authService from "../auth/authService";
import loginIllustration from "../assets/Gemini_Generated_Image_6xm22i6xm22i6xm2.png";

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
      console.error("Login failed:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Invalid email or password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const primaryMaroon = "#AE2050";
  const white = "#FFFFFF";
  const lightGray = "#718096";

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
                        <Field.Root w="full">
                          <Field.Label fontWeight="medium" mb={2}>
                            Enter Password
                          </Field.Label>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
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
                          Login
                        </Button>

                        <Button
                          variant="ghost"
                          color={primaryMaroon}
                          onClick={() => setStep(1)}
                          w="full"
                          _hover={{ bg: "transparent", opacity: 0.8 }}
                        >
                          Back
                        </Button>
                      </VStack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default LoginPage;
