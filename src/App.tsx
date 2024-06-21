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
import SearchNotes from "./components/app-notes-list/app-notes-list";
import PrivateRoute from "./auth/routes/private-routes";
import PublicRoute from "./auth/routes/public-routes";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Container maxWidth="7xl">
        <Routes>
        <Route element={<PublicRoute />}>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/notes-list" element={<SearchNotes />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  </ChakraProvider>
);
