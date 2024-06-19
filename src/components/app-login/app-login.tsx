import React, { useState, ChangeEvent, FormEvent, FC, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, FormHelperText, useToast } from "@chakra-ui/react";
import { LoginUserRequest } from "../../models/login-user-request";
import { LoginUserRequestMessage } from "../../models/login-user-request-message";
import { useNavigate } from "react-router-dom";



export const LoginForm: FC = () => {
  const [formData, setFormData] = useState<Partial<LoginUserRequest>>({});
  const [errorMessage, setErrorMessage] = useState<Partial<LoginUserRequestMessage>>({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profil");
    }
  }, [navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistrationRedirect = () => {
    navigate("/");
  };


  const validateField = (name: string, value: string) => {
    let message = "";
    switch (name) {
      case "username":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) message = "Felhasználónév kötelező";
        else if (!emailRegex.test(value)) message = "Érvénytelen email cím";
        break;
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!value.trim())  message = "Jelszó kötelező";
        else if (!passwordRegex.test(value)) message = "A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell legalább egy számot és egy kisbetűt.";
        break;
      default:
        break;
    }
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: message }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, password } = formData;

    // Validáció ellenőrzése
    validateField("username", username??"");
    validateField("password", password??"");

    if (errorMessage.username || errorMessage.password) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if(response.status==400){
          toast({
            title: "Sikertelen belépés",
            description: "A bevitt adatok érvénytelenek",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }else if(response.status==401){
          toast({
            title: "Sikeres belépés",
            description: "Hibás felhasználónév vagy jelszó",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        throw new Error("Hiba történt a bejelentkezés során");
      }

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      console.log(data.accessToken);
      

      toast({
        title: "Sikeres bejelentkezés",
        description: "Sikeresen bejelentkezett",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      navigate("/profil");
    } catch (error:any) {
      toast({
        title: "Hiba",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isRequired isInvalid={!!errorMessage.username}>
          <FormLabel>Felhasználónév</FormLabel>
          <Input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => validateField("username", formData.username??"")}
          />
          <FormHelperText color="red">{errorMessage.username}</FormHelperText>
        </FormControl>
        <FormControl id="password" isRequired mt={4} isInvalid={!!errorMessage.password}>
          <FormLabel>Jelszó</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => validateField("password", formData.password??"")}
          />
          <FormHelperText color="red">{errorMessage.password}</FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="blue" mt={4}>
          Bejelentkezés
        </Button>
        <Button type="button" colorScheme="teal" mt={4} ml={4} onClick={handleRegistrationRedirect}>
          Még nincs fiókod? Kattints ide a regisztrációhoz
        </Button>
      </form>
    </Box>
  );
};
