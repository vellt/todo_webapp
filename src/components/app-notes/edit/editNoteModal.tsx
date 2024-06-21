import React, { useState, useEffect, FC } from 'react';
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

interface EditNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNoteEdited: (note: any) => void;
    noteId: string;
}

const EditNoteModal: FC<EditNoteModalProps> = ({ isOpen, onClose, onNoteEdited, noteId }) => {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('yellow');
    const [isFavorite, setIsFavorite] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/notes/${noteId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const note = await response.json();
                    setTitle(note.title);
                    setColor(note.color);
                    setIsFavorite(note.isFavorite);
                } else {
                    throw new Error('A jegyzet betöltése nem sikerült.');
                }
            } catch (error: any) {
                console.error(error.message);
            }
        };

        if (isOpen) {
            fetchNote();
        } else {
            setTitle('');
            setColor('yellow');
            setIsFavorite(false);
            setErrors({});
        }
    }, [isOpen, noteId]);

    const validate = () => {
        const newErrors: any = {};
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
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/notes/${noteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, color, isFavorite })
            });

            if (response.ok) {
                const note = await response.json();
                onNoteEdited(note);
            } else if (response.status === 409) {
                setErrors({ title: 'A megadott cím már létezik.' });
            } else {
                throw new Error('Ismeretlen hiba történt.');
            }
        } catch (error: any) {
            setErrors({ form: error.message });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Jegyzet módosítása</ModalHeader>
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
                                <option value="yellow">Sárga</option>
                                <option value="green">Zöld</option>
                                <option value="blue">Kék</option>
                                <option value="red">Piros</option>
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
                        <Button colorScheme="blue" type="submit">Módosítás</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default EditNoteModal;
