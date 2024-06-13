import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Box, Button, FormControl, FormHelperText, FormLabel, Input, useDisclosure } from "@chakra-ui/react";
import { RegisterUserRequestBody } from "../../models/register-user-request-body";
import { RegisterUserRequestBodyMessage } from "../../models/register-user-request-body-message";
import { ModalAlert } from "./modal-alert";
import { useNavigate } from "react-router-dom";

export const RegistrationForm: FC = () => {
  const [formData, setFormData] = useState<Partial<RegisterUserRequestBody>>({});
  const [errorMessage, setErrorMessage] = useState<Partial<RegisterUserRequestBodyMessage>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState<{ title: string, message: string }>({ title: "", message: "" });
  const initialFormData = { username: "", password: "", passwordConfirm: "", firstName: "", lastName: ""};

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profil");
    }
  }, [navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value});
  };

  const validateField = (name: string, value: string) => {
    let message = "";

    switch (name) {
      case "username":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        message = !value.trim() ? "Kötelező kitölteni" : !emailRegex.test(value) ? "Érvénytelen email cím" : "";
        break;
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
        message = !value ? "Kötelező kitölteni" : !passwordRegex.test(value) ? "A jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel" : "";
        break;
      case "passwordConfirm":
        message = !value ? "Kötelező kitölteni" : value !== formData.password ? "A tartalmának meg kell egyezzen a jelszó mezőjének tartalmával" : "";
        break;
      case "lastName":
      case "firstName":
        message = !value ? "Kötelező kitölteni" : "";
        break;
    }

    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: message }));
  };



  const handleSubmit =async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const response = await fetch("http://localhost:5000/user", {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          if(response.status==400) {
            setModalContent({ title: "Regisztrációs hiba", message: "A bevitt adatok érvénytelenek" });
          }else if(response.status==409){
            setModalContent({ title: "Regisztrációs hiba", message: "A felhasználó már létezik" });
          }else{
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }else{
          setModalContent({ title: "Sikeres regisztráció", message: "A regisztráció sikeres volt." });
          handleCancel();
        }
      } catch (error:any) {
        setModalContent({ title: "Regisztrációs hiba", message: error.message });
      } finally {
        onOpen();
      }
    
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrorMessage(initialFormData);
  };


  const handleLoginRedirect = () => {
    navigate("/login"); // Irányítás a bejelentkezési oldalra
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isRequired isInvalid={!!errorMessage.username}>
          <FormLabel>Felhasználónév</FormLabel>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => validateField("username", formData.username??"")} />
          <FormHelperText color="red">{errorMessage.username}</FormHelperText>
        </FormControl>
        <FormControl id="password" isRequired mt={4}>
          <FormLabel>Jelszó</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => validateField("password", formData.password??"")} />
          <FormHelperText color="red">{errorMessage.password}</FormHelperText>
        </FormControl>
        <FormControl id="passwordConfirm" isRequired mt={4}>
          <FormLabel>Jelszó megerősítése</FormLabel>
          <Input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            onBlur={() => validateField("passwordConfirm", formData.passwordConfirm??"")} />
          <FormHelperText color="red">{errorMessage.passwordConfirm}</FormHelperText>
        </FormControl>
        <FormControl id="firstName" isRequired mt={4}>
          <FormLabel>Vezetéknév</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={() => validateField("firstName", formData.firstName??"")} />
          <FormHelperText color="red">{errorMessage.firstName}</FormHelperText>
        </FormControl>
        <FormControl id="lastName" isRequired mt={4}>
          <FormLabel>Keresztnév</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={() => validateField("lastName", formData.firstName??"")} />
          <FormHelperText color="red">{errorMessage.lastName}</FormHelperText>
        </FormControl>
        <Button type="button" colorScheme="gray" mt={4} onClick={handleCancel}>
          Mégsem
        </Button>
        <Button type="submit" colorScheme="blue" mt={4} ml={4}
          isDisabled={Object.values(errorMessage).some((error) => error !== "")}>
          Regisztráció
        </Button>
        <Button type="button" colorScheme="teal" mt={4} ml={4} onClick={handleLoginRedirect}>
          Van fiókod? Kattints ide a bejelentkezéshez
        </Button>
      </form>
      <ModalAlert
        isOpen={isOpen}
        onClose={onClose}
        title={modalContent.title}
        message={modalContent.message}
      />
    </Box>
  );
};
