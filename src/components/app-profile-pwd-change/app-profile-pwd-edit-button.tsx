import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import ChangePasswordForm from './app-profile-pwd-edit';


const PasswordChangeButton: FC = () => {
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
        onOpen();
    };

    return (
        <Box>
            <Button width="100%" onClick={handleOpenPasswordChangeModal} colorScheme="orange" margin={1} mt={4}>
                Jelszó megváltoztatása
            </Button>
            <ChangePasswordForm
                isOpen={isOpen}
                onClose={onClose}
                onPasswordChanged={handlePasswordChanged}
            />
        </Box>
    );
};

export default PasswordChangeButton;