import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import CreateNoteModal from "./createNotes";

interface NoteButtonProps {
    onClick: () => void;
}

const NoteButton: FC<NoteButtonProps> = ({ onClick }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleNoteCreated = (note: any) => {
        if (note.error) {
            toast({
                title: "Hiba történt.",
                description: note.error,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Jegyzet létrehozva.",
                description: `A(z) "${note.title}" jegyzet sikeresen létrehozva.`,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onClick();
        }
    };

    const handleCreateNoteClick = () => {
        onOpen();
    };

    return (
        <>
            <Button width="100%" onClick={handleCreateNoteClick} colorScheme="teal" mt={4}>
                Új jegyzet létrehozása
            </Button>
            <CreateNoteModal isOpen={isOpen} onClose={onClose} onNoteCreated={handleNoteCreated} />
        </>
    );
};

export default NoteButton;
