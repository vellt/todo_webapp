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
    FormErrorMessage,
} from '@chakra-ui/react';
import AuthService from '../../auth/auth-service';

interface UserProfileFormProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdated: (user: any) => void;
    initialFirstName: string;
    initialLastName: string;
}

const UserProfileForm: FC<UserProfileFormProps> = ({ isOpen, onClose, onProfileUpdated, initialFirstName, initialLastName }) => {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [error, setError] = useState<any>({});

    const resetForm = () => {
        setFirstName(initialFirstName);
        setLastName(initialLastName);
        setError({});
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen, initialFirstName, initialLastName]);

    const validate = () => {
        const newErrors: any = {};
        if (!firstName) {
            newErrors.firstName = 'A keresztnév megadása kötelező.';
        }
        if (!lastName) {
            newErrors.lastName = 'A vezetéknév megadása kötelező.';
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({ firstName, lastName })
            });

            if (response.status === 200) {
                const updatedUser = await response.json();
                onProfileUpdated(updatedUser);
            } else if (response.status === 401) {
                setError({ form: 'Unauthorized. Please log in again.' });
            } else {
                setError({ form: 'Hiba történt az adatok frissítése során.' });
            }
        } catch (error: any) {
            setError({ form: error.message });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Profil frissítése</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormControl isInvalid={!!error.firstName}>
                            <FormLabel>Keresztnév</FormLabel>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Keresztnév"
                            />
                            <FormErrorMessage>{error.firstName}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!error.lastName}>
                            <FormLabel>Vezetéknév</FormLabel>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Vezetéknév"
                            />
                            <FormErrorMessage>{error.lastName}</FormErrorMessage>
                        </FormControl>
                        {error.form && (
                            <FormControl isInvalid={true} mt={4}>
                                <FormErrorMessage>{error.form}</FormErrorMessage>
                            </FormControl>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} mr={3}>Mégse</Button>
                        <Button colorScheme="teal" type="submit">Mentés</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default UserProfileForm;
