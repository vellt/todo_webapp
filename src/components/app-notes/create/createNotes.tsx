import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Checkbox,
    FormErrorMessage,
} from '@chakra-ui/react';

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNoteCreated: (note: any) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onNoteCreated }) => {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('yellow');
    const [isFavorite, setIsFavorite] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const resetForm = () => {
        setTitle('');
        setColor('yellow');
        setIsFavorite(false);
        setErrors({});
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title) {
            newErrors.title = 'A cím megadása kötelező.';
        } else if (title.length < 3) {
            newErrors.title = 'A címnek legalább 3 karakter hosszúnak kell lennie.';
        } else if (title.length > 100) {
            newErrors.title = 'A cím legfeljebb 100 karakter hosszú lehet.';
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, color, isFavorite })
            });

            if (response.ok) {
                const note = await response.json();
                onNoteCreated(note);
                onClose();
            } else if (response.status === 409) {
                const errorData = await response.json();
                onNoteCreated({ error: errorData.message || 'Conflict - a megadott jegyzet már létezik ilyen címmel' });
            } else if (response.status >= 500) {
                onNoteCreated({ error: 'Szerver oldali hiba történt. Kérjük, próbálja újra később.' });
            } else {
                const errorData = await response.json();
                onNoteCreated({ error: errorData.message || 'Ismeretlen hiba történt.' });
            }
        } catch (error: any) {
            onNoteCreated({ error: error.message || 'Ismeretlen hiba történt.' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Jegyzet létrehozása</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormControl isInvalid={!!errors.title}>
                            <FormLabel>Cím</FormLabel>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Cím"
                            />
                            <FormErrorMessage>{errors.title}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Szín</FormLabel>
                            <Select value={color} onChange={(e) => setColor(e.target.value)}>
                                <option value="yellow">sárga</option>
                                <option value="green">zöld</option>
                                <option value="blue">kék</option>
                                <option value="red">piros</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <Checkbox isChecked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)}>
                                Kedvenc
                            </Checkbox>
                        </FormControl>
                        {errors.form && (
                            <FormControl isInvalid={true} mt={4}>
                                <FormErrorMessage>{errors.form}</FormErrorMessage>
                            </FormControl>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} mr={3}>Mégse</Button>
                        <Button colorScheme="teal" type="submit">Rögzítés</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default CreateNoteModal;
