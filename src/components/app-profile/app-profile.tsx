import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NoteButton from "../app-notes/create/noteButton";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const watchList = () =>{
    navigate("/list");
  }
  const searchList = () =>{
    navigate("/search");
  }

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <Text>Email: {userData.email}</Text>
      <Text>First Name: {userData.firstName}</Text>
      <Text>Last Name: {userData.lastName}</Text>
      <Button colorScheme="red" margin={1} mt={4} onClick={handleLogout}>
        Kijelentkezés
      </Button>
      <Button colorScheme="green" margin={1} mt={4} onClick={watchList}>
        Jegyzetek listázása
      </Button>
      <Button colorScheme="blue" margin={1} mt={4} onClick={searchList}>
        Jegyzet keresés
      </Button>
      {/*
      Ezt a három gombot kell belerakni a kódba és működni fog
      */}

      <NoteButton />
      {/*<EditNoteButton noteId={note.id} />*/}
      {/*<DeleteNoteButton noteId={note.id} />*/}

      {/*********************************************/}
    </Box>

  );
  
};

export default ProfilePage;
