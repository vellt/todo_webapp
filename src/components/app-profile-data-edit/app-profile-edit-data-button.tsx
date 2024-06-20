import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import UserProfileForm from './app-profile-edit-data';

interface ProfileButtonProps {
    initialFirstName: string;
    initialLastName: string;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ initialFirstName, initialLastName }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleProfileUpdated = (user: any) => {
        toast({
            title: "Profil frissítve.",
            description: `A profil sikeresen frissítve: ${user.firstName} ${user.lastName}.`,
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        onClose();
    };

    const handleOpenProfileModal = () => {
        const token = localStorage.getItem('token');
        if (token) {
            onOpen();
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <Button onClick={handleOpenProfileModal} colorScheme="purple" mt={4}>
                Profil frissítése
            </Button>
            <UserProfileForm
                isOpen={isOpen}
                onClose={onClose}
                onProfileUpdated={handleProfileUpdated}
                initialFirstName={initialFirstName}
                initialLastName={initialLastName}
            />
        </>
    );
};

export default ProfileButton;
