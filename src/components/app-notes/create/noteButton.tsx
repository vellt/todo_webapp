import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import CreateNoteModal from "./createNotes"; // importáld a CreateNoteModal komponenst

const NoteButton: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleNoteCreated = (note: any) => {
        toast({
            title: "Jegyzet létrehozva.",
            description: `A(z) "${note.title}" jegyzet sikeresen létrehozva.`,
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        onClose();
        // itt frissítheted a keresési listát ha szükséges
    };

    const handleCreateNoteClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            onOpen();
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <Button onClick={handleCreateNoteClick} colorScheme="teal" mt={4}>
                Új jegyzet létrehozása
            </Button>
            <CreateNoteModal isOpen={isOpen} onClose={onClose} onNoteCreated={handleNoteCreated} />
        </>
    );
};

export default NoteButton;
