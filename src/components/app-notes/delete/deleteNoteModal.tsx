import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    Text
} from '@chakra-ui/react';

interface DeleteNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNoteDeleted: () => void;
    noteId: string;
}

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({ isOpen, onClose, onNoteDeleted, noteId }) => {
    const toast = useToast();

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Nem található érvényes token. Kérjük, jelentkezzen be újra.');
            }

            const response = await fetch(`http://localhost:5000/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                onNoteDeleted();
            } else if (response.status === 404) {
                throw new Error('A jegyzet nem található.');
            } else if (response.status === 403) {
                throw new Error('Nincs jogosultsága a jegyzet törléséhez.');
            } else {
                throw new Error('A jegyzet törlése sikertelen.');
            }
        } catch (error: any) {
            toast({
                title: "Hiba történt.",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Jegyzet törlése</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Biztosan törölni szeretnéd a jegyzetet? Ez a művelet nem vonható vissza, és az összes idetartozó feladat is eltávolításra kerül.</Text>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} mr={3}>Mégse</Button>
                    <Button colorScheme="red" onClick={handleDelete}>Törlés</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteNoteModal;
