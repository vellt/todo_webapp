import React from 'react';
import { useDisclosure, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import EditNoteModal from "./editNoteModal";

interface EditNoteButtonProps {
    noteId: string;
    onClick: () => void;  // callback függvény, a képernyőfrisstéshez
}

const EditNoteButton: React.FC<EditNoteButtonProps> = ({ noteId, onClick }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleNoteEdited = (note: any) => {
        toast({
            title: "Jegyzet módosítva.",
            description: `A(z) "${note.title}" jegyzet sikeresen módosítva.`,
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        onClose();
        onClick();  // callback függvényt itt hívjuk meg
    };

    const handleEditNoteClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            onOpen();
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <Button onClick={handleEditNoteClick} colorScheme="blue" mt={4}>
                Szerkesztés
            </Button>
            <EditNoteModal isOpen={isOpen} onClose={onClose} onNoteEdited={handleNoteEdited} noteId={noteId} />
        </>
    );
};

export default EditNoteButton;
