import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

interface Note {
    id: string;
    title: string;
    creationDate: string;
    color: string;
}

interface NoteListProps {
    notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
    return (
        <Box>
            {notes.map(note => (
                <Box key={note.id} p={5} shadow="md" borderWidth="1px" mb={4}>
                    <Heading fontSize="xl">{note.title}</Heading>
                    <Text mt={4}>Creation Date: {new Date(note.creationDate).toLocaleString()}</Text>
                    <Button mt={4} as={Link} to={`/notes/${note.id}`} colorScheme="teal">
                        Részletek
                    </Button>
                </Box>
            ))}
        </Box>
    );
};

export default NoteList;
