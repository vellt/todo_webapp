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
    FormErrorMessage,
} from '@chakra-ui/react';

interface ChangePasswordFormProps {
    isOpen: boolean;
    onClose: () => void;
    onPasswordChanged: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ isOpen, onClose, onPasswordChanged }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errors, setErrors] = useState<any>({});

    const resetForm = () => {
        setOldPassword('');
        setPassword('');
        setPasswordConfirm('');
        setErrors({});
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: any = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!oldPassword) {
            newErrors.oldPassword = 'Az régi jelszó megadása kötelező.';
        } else if (!passwordRegex.test(oldPassword)) {
            newErrors.oldPassword = 'A régi jelszó nem felel meg a követelményeknek.';
        }

        if (!password) {
            newErrors.password = 'Az új jelszó megadása kötelező.';
        } else if (!passwordRegex.test(password)) {
            newErrors.password = 'Az új jelszó nem felel meg a követelményeknek.';
        } else if (password === oldPassword) {
            newErrors.password = 'Az új jelszó nem egyezhet meg a régi jelszóval.';
        }

        if (!passwordConfirm) {
            newErrors.passwordConfirm = 'Az új jelszó megerősítése kötelező.';
        } else if (password !== passwordConfirm) {
            newErrors.passwordConfirm = 'A két jelszó nem egyezik meg.';
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
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ oldPassword, password, passwordConfirm})
            });
            console.log(response);
            

            if (response.status === 204) {
                onPasswordChanged();
            } else if (response.status === 401) {
                setErrors({ form: 'Hiányzó vagy érvénytelen token.' });
            } else if (response.status === 409) {
                setErrors({ form: 'A régi és az új jelszó azonos.' });
            } else {
                setErrors({ form: 'A bevitt adatok érvénytelenek' });
            }
        } catch (error: any) {
            setErrors({ form: error.message });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Jelszó megváltoztatása</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormControl isInvalid={!!errors.oldPassword}>
                            <FormLabel>Régi jelszó</FormLabel>
                            <Input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Régi jelszó"
                            />
                            <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.password}>
                            <FormLabel>Új jelszó</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Új jelszó"
                            />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.passwordConfirm}>
                            <FormLabel>Új jelszó megerősítése</FormLabel>
                            <Input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Új jelszó megerősítése"
                            />
                            <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>
                        </FormControl>
                        {errors.form && (
                            <FormControl isInvalid={true} mt={4}>
                                <FormErrorMessage>{errors.form}</FormErrorMessage>
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

export default ChangePasswordForm;
