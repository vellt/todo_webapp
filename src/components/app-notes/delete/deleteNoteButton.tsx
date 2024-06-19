import React from 'react';
import { useDisclosure, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import DeleteNoteModal from "./deleteNoteModal";

interface DeleteNoteButtonProps {
    noteId: string;
}

const DeleteNoteButton: React.FC<DeleteNoteButtonProps> = ({ noteId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleNoteDeleted = () => {
        toast({
            title: "Jegyzet törölve.",
            description: "A jegyzet sikeresen törölve.",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        onClose();

    };

    const handleDeleteNoteClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            onOpen();
        } else {
            navigate('/login');
        }
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
