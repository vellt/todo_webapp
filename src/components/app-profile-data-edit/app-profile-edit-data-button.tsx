import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Stack,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import UserProfileForm from './app-profile-edit-data';

interface ProfileButtonProps {
    initialFirstName: string;
    initialLastName: string;
    onClick: () => void;  // callback függvény, a képernyőfrisstéshez
}

const ProfileButton: FC<ProfileButtonProps> = ({ initialFirstName, initialLastName, onClick }) => {
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
        onClick();  // callback függvényt itt hívjuk meg
    };

    const handleOpenProfileModal = () => {
        onOpen();
    };

    return (
        <Box >
            <Button width="100%" onClick={handleOpenProfileModal} colorScheme="purple" margin={1} mt={4}>
                Profil frissítése
            </Button>
            <UserProfileForm
                isOpen={isOpen}
                onClose={onClose}
                onProfileUpdated={handleProfileUpdated}
                initialFirstName={initialFirstName}
                initialLastName={initialLastName}
            />
        </Box>
    );
};

export default ProfileButton;
