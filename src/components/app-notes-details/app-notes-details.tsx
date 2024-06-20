import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    List,
    ListItem,
    Button,
    Spinner,
    Alert,
    AlertIcon
} from '@chakra-ui/react';

interface Note {
    id: string;
    title: string;
    creationDate: string;
    color: string;
    items: { label: string; isDone: boolean; id: string }[];
}

const NoteDetails: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`http://localhost:5000/notes/${noteId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNote(data);
                } else if (response.status === 404) {
                    setError('A megadott jegyzet nem található.');
                } else {
                    setError('Hiba történt a jegyzet betöltése során.');
                }
            } catch (err) {
                setError('A szerver nem elérhető. Kérjük, próbálja meg később.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [noteId]);

    const handleEdit = () => {
        navigate(`/edit-note/${noteId}`);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Biztosan törölni szeretné a jegyzetet?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/notes/${noteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    navigate('/');
                } else {
                    setError('Hiba történt a jegyzet törlése során.');
                }
            } catch (err) {
                setError('A szerver nem elérhető. Kérjük, próbálja meg később.');
            }
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Heading>{note?.title}</Heading>
            <Text>Creation Date: {note?.creationDate ? new Date(note.creationDate).toLocaleString() : 'Unknown'}</Text>
            <List spacing={3} mt={4}>
                {note?.items.map((item) => (
                    <ListItem key={item.id}>
                        <Text as={item.isDone ? 'del' : undefined}>{item.label}</Text>
                    </ListItem>
                ))}
            </List>
            <Button mt={4} onClick={handleEdit} colorScheme="teal">Szerkesztés</Button>
            <Button mt={4} ml={2} onClick={handleDelete} colorScheme="red">Törlés</Button>
        </Box>
    );
};

export default NoteDetails;
