import React, { FC } from 'react';
import { useDisclosure, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import EditNoteModal from "./editNoteModal";

interface EditNoteButtonProps {
    noteId: string;
    onClick: () => void;
}

const EditNoteButton: FC<EditNoteButtonProps> = ({ noteId, onClick }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleNoteEdited = (note: any, error: string | null = null) => {
        if (error) {
            toast({
                title: "Hiba történt.",
                description: error,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Jegyzet módosítva.",
                description: `A(z) "${note.title}" jegyzet sikeresen módosítva.`,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onClick();
        }
    };

    const handleEditNoteClick = () => {
        onOpen();
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
