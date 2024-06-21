import React, { FC } from 'react';
import { useDisclosure, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import DeleteNoteModal from "./deleteNoteModal";

interface DeleteNoteButtonProps {
    noteId: string;
    onClick: () => void;
}

const DeleteNoteButton: FC<DeleteNoteButtonProps> = ({ noteId, onClick }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleNoteDeleted = (error: string | null = null) => {
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
                title: "Jegyzet törölve.",
                description: "A jegyzet sikeresen törölve.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onClick();
        }
    };

    const handleDeleteNoteClick = () => {
        onOpen();
    };

    return (
        <>
            <Button onClick={handleDeleteNoteClick} colorScheme="red" mt={4}>
                Jegyzet törlése
            </Button>
            <DeleteNoteModal isOpen={isOpen} onClose={onClose} onNoteDeleted={handleNoteDeleted} noteId={noteId} />
        </>
    );
};

export default DeleteNoteButton;
