import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { Box, Button, FormControl, FormLabel, Input, FormHelperText, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../auth/auth-service";

interface LoginUserRequest{
  username:string;
  password:string;
}

interface LoginUserRequestMessage extends LoginUserRequest{}

export const LoginForm: FC = () => {
  const [formData, setFormData] = useState<Partial<LoginUserRequest>>({});
  const [errorMessage, setErrorMessage] = useState<Partial<LoginUserRequestMessage>>({});
  const toast = useToast();
  const navigate = useNavigate();

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

    validateField("username", username??"");
    validateField("password", password??"");

    if (errorMessage.username || errorMessage.password) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if(response.status===400){
          toast({
            title: "Sikertelen belépés",
            description: "A bevitt adatok érvénytelenek",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }else if(response.status===401){
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
      AuthService.login(data.accessToken);
      
      toast({
        title: "Sikeres bejelentkezés",
        description: "Sikeresen bejelentkezett",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      navigate("/profil");
    } catch (error:any) {
      console.error('Error deleting task:', error);
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
        <Button  width='100%' type="submit" colorScheme="blue" mt={4}>
          Bejelentkezés
        </Button>
        <Button width='100%' type="button" colorScheme="teal" mt={4} onClick={handleRegistrationRedirect}>
          Még nincs fiókod? Kattints ide a regisztrációhoz
        </Button>
      </form>
    </Box>
  );
};
