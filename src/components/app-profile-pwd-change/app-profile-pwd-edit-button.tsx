import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import ChangePasswordForm from './app-profile-pwd-edit';


const PasswordChangeButton: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handlePasswordChanged = () => {
        toast({
            title: "Jelszó frissítve.",
            description: "A jelszó sikeresen frissítve.",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        onClose();
    };

    const handleOpenPasswordChangeModal = () => {
        const token = localStorage.getItem('token');
        if (token) {
            onOpen();
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <Button onClick={handleOpenPasswordChangeModal} colorScheme="orange" mt={4}>
                Jelszó megváltoztatása
            </Button>
            <ChangePasswordForm
                isOpen={isOpen}
                onClose={onClose}
                onPasswordChanged={handlePasswordChanged}
            />
        </>
    );
};

export default PasswordChangeButton;