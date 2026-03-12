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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginInfo from "../components/LoginInfo";
import authService from "../auth/authService";
import {
  LuCircleUser,
  LuShieldCheck,
  LuScale,
  LuCircleHelp,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPassword, resetPassword, checkEmail } from "../api/authServices";
import loginIllustration from "../assets/133748214_10221134.jpg";

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await checkEmail({ email });
      console.log("Email check response:", response.data);

      // Simple check: if the API returns a response that explicitly says it doesn't exist
      // or if it returns an error status in the body
      if (
        response.data &&
        (response.data.exists === false ||
          response.data.status === "error" ||
          response.data.error)
      ) {
        setError(
          response.data.error ||
            response.data.message ||
            "This email is not registered. Please check and try again.",
        );
        return;
      }

      // If the request succeeds and we have no reason to believe otherwise
      setStep(2);
    } catch (err) {
      console.error("Email check failed:", err);
      const backendError = err.response?.data;
      let errorMessage =
        "This email is not registered. Please check and try again.";

      if (backendError) {
        if (typeof backendError === "string") {
          errorMessage = backendError;
        } else if (backendError.detail) {
          errorMessage = backendError.detail;
        } else if (backendError.error) {
          errorMessage = backendError.error;
        } else if (backendError.message) {
          errorMessage = backendError.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await forgotPassword({ email });
      setMessage("OTP sent to your email.");
      setStep(4);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to send OTP. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await resetPassword({ email, otp, new_password: newPassword });
      setMessage("Password reset successfully. You can now log in.");
      setStep(2); // Go back to password entry step
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to reset password. Check your OTP.",
      );
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
    <Box
      bg={white}
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <Box
        flex="1"
        overflow="hidden"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          w="full"
          h="full"
          bg="white"
          overflow="hidden"
          boxShadow="2xl"
          direction={{ base: "column", md: "row" }}
        >
          <LoginInfo />

          {/* Right Side: Form */}
          <Box
            flex="1"
            p={{ base: 8, md: 12 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            bg="white"
          >
            <VStack align="start" gap={"20px"} w="full" maxW="400px" mx="auto">
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

              {message && (
                <Box
                  p={3}
                  bg="green.50"
                  color="green.600"
                  borderRadius="md"
                  w="full"
                  textAlign="center"
                  border="1px solid"
                  borderColor="green.200"
                >
                  <Text fontSize="sm">{message}</Text>
                </Box>
              )}

              <Box w="full" position="relative">
                <form
                  style={{ width: "100%" }}
                  onSubmit={
                    step === 1
                      ? handleNext
                      : step === 2
                        ? handleLogin
                        : step === 3
                          ? handleForgotPassword
                          : handleResetPassword
                  }
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
                        <VStack gap={"10px"} align="start" w="full">
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
                    ) : step === 2 ? (
                      <motion.div
                        key="step2"
                        custom={-1}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <VStack gap={"18px"} align="start" w="full">
                          {/* Registered Email Display */}
                          <HStack gap={3} w="full" py={2}>
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
                              onClick={() => {
                                setStep(1);
                                setError("");
                                setMessage("");
                              }}
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
                            <HStack gap={2}>
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
                              onClick={() => {
                                setError("");
                                setMessage("");
                                setStep(3);
                              }}
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
                          <HStack justify="center" w="full" gap="25px" pt={1}>
                            <HStack
                              gap={1}
                              color="gray.600"
                              cursor="pointer"
                              _hover={{ color: primaryMaroon }}
                            >
                              <Icon as={LuShieldCheck} boxSize={3} />
                              <Text fontSize="xs" fontWeight="medium">
                                Privacy
                              </Text>
                            </HStack>
                            <HStack
                              gap={1}
                              color="gray.600"
                              cursor="pointer"
                              _hover={{ color: primaryMaroon }}
                            >
                              <Icon as={LuScale} boxSize={3} />
                              <Text fontSize="xs" fontWeight="medium">
                                Terms
                              </Text>
                            </HStack>
                            <HStack
                              gap={1}
                              color="gray.600"
                              cursor="pointer"
                              _hover={{ color: primaryMaroon }}
                            >
                              <Icon as={LuCircleHelp} boxSize={3} />
                              <Text fontSize="xs" fontWeight="medium">
                                FAQ
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </motion.div>
                    ) : step === 3 ? (
                      <motion.div
                        key="step3"
                        custom={1}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <VStack spacing={6} align="start" w="full">
                          <Heading as="h3" size="md">
                            Forgot Password
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            Enter your email address and we'll send you an OTP
                            to reset your password.
                          </Text>
                          <Field.Root w="full">
                            <Field.Label fontWeight="medium" mb={2}>
                              Email Address
                            </Field.Label>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your@email.com"
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
                          >
                            Send OTP
                          </Button>

                          <Button
                            variant="ghost"
                            w="full"
                            onClick={() => {
                              setStep(1);
                              setError("");
                              setMessage("");
                            }}
                          >
                            Back to Login
                          </Button>
                        </VStack>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step4"
                        custom={1}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <VStack gap={2} align="start" w="full">
                          <Heading as="h3" size="md">
                            Reset Password
                          </Heading>
                          <Text fontSize="xs" color="gray.500">
                            Resetting password for: <b>{email}</b>
                          </Text>

                          <Field.Root w="full">
                            <Field.Label fontWeight="bold">OTP</Field.Label>
                            <Input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              required
                              size="md"
                              borderRadius="md"
                              borderColor="gray.400"
                            />
                          </Field.Root>

                          <Field.Root w="full">
                            <Field.Label fontWeight="bold">
                              New Password
                            </Field.Label>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New Password"
                              required
                              size="md"
                              borderRadius="md"
                              borderColor="gray.400"
                            />
                          </Field.Root>

                          <Field.Root w="full">
                            <Field.Label fontWeight="bold">
                              Confirm Password
                            </Field.Label>
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Confirm Password"
                              required
                              size="md"
                              borderRadius="md"
                              borderColor="gray.400"
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
                            mt={2}
                          >
                            Reset Password
                          </Button>

                          <Button
                            variant="ghost"
                            w="full"
                            onClick={() => {
                              setStep(3);
                              setError("");
                              setMessage("");
                            }}
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

      <Footer />
    </Box>
  );
};

export default LoginPage;
