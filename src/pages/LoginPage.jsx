import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import authService from "../auth/authService";

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
      // Using email as requested by user for the new endpoint
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

  const primaryGold = "#E6B566";
  const white = "#FFFFFF";

  return (
    <Box
      bg={white}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="sm">
        <VStack
          spacing={8}
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={primaryGold}
          bg={white}
        >
          <Heading as="h1" size="xl" color={primaryGold} textAlign="center">
            Login
          </Heading>

          <form
            style={{ width: "100%" }}
            onSubmit={step === 1 ? handleNext : handleLogin}
          >
            <VStack spacing={4}>
              {step === 1 ? (
                <Field.Root>
                  <Field.Label color={primaryGold}>Email Address</Field.Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    borderColor={primaryGold}
                    _focus={{
                      borderColor: primaryGold,
                      boxShadow: `0 0 0 1px ${primaryGold}`,
                    }}
                  />
                </Field.Root>
              ) : (
                <Field.Root>
                  <Field.Label color={primaryGold}>Password</Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    borderColor={primaryGold}
                    _focus={{
                      borderColor: primaryGold,
                      boxShadow: `0 0 0 1px ${primaryGold}`,
                    }}
                    autoFocus
                  />
                </Field.Root>
              )}

              <Button
                type="submit"
                w="full"
                bg={primaryGold}
                color={white}
                _hover={{ bg: "#d4a455" }}
                isLoading={isLoading}
              >
                {step === 1 ? "Next" : "Login"}
              </Button>

              {step === 2 && (
                <Button
                  variant="ghost"
                  color={primaryGold}
                  onClick={() => setStep(1)}
                  w="full"
                  _hover={{ bg: "transparent", opacity: 0.8 }}
                >
                  Back
                </Button>
              )}
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;
