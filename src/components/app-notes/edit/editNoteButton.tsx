import React from 'react';
import { useDisclosure, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import EditNoteModal from "./editNoteModal";

interface EditNoteButtonProps {
    noteId: string;
}

const EditNoteButton: React.FC<EditNoteButtonProps> = ({ noteId }) => {
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
                Edit note
            </Button>
            <EditNoteModal isOpen={isOpen} onClose={onClose} onNoteEdited={handleNoteEdited} noteId={noteId} />
        </>
    );
};

export default EditNoteButton;
