
import React, { useState } from 'react';
import { Box, Button, Text, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, useToast } from '@chakra-ui/react';

interface TaskDeleteProps {
    taskid: string; notesid: string;
    onClick: () => void; // callback függvény, a képernyőfrisstéshez
    }

    const TaskDelete : React.FC<TaskDeleteProps> = ({ taskid, notesid, onClick }) => {
        const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No token found",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/notes/${notesid}/${taskid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        toast({
          title: "Sikeres törlés",
          description: "",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClick();
      } else if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Ismeretlen felhasználó, hiányzó vagy érvénytelen token",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (response.status === 404) {
        toast({
          title: "Not Found",
          description: "A fórum vagy hozzászólás nem található",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Ismeretlen hiba",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    onDeleteClose();
  };

  return (
    <Box>
        <Flex>
        <Button colorScheme="red" onClick={onDeleteOpen}>Törlés</Button>
        </Flex>
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Törlés megerősítése</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Biztos törölni akarod a feladatot?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteClose}>Mégsem</Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>Igen</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskDelete;

