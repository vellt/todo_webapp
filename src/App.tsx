import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ChakraProvider,
  Container,
  theme
} from "@chakra-ui/react";
import { RegistrationForm } from "./components/app-registration/app-registration";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Container maxWidth="7xl">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          {/* További útvonalak */}
        </Routes>
      </Container>
    </Router>
  </ChakraProvider>
);
