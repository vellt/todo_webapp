import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ChakraProvider,
  Container,
  theme
} from "@chakra-ui/react";
import { RegistrationForm } from "./components/app-registration/app-registration";
import ProfilePage from "./components/app-profile/app-profile";
import { LoginForm } from "./components/app-login/app-login";
import SearchNotes from "./components/app-search-todo/app-search-todo";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Container maxWidth="7xl">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profil" element={<ProfilePage />}/>
          <Route path="/search" element={<SearchNotes/>}/>
        </Routes>
      </Container>
    </Router>
  </ChakraProvider>
);
