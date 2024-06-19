import React, { useState } from 'react';
import {
  Box, Input, Button, Stack, Checkbox, Select, Text,
  Flex, FormControl, FormLabel, Spinner
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EditNoteButton from '../app-notes/edit/editNoteButton';
import DeleteNoteButton from '../app-notes/delete/deleteNoteButton';

const SearchNotes: React.FC = () => {
  const [query, setQuery] = useState('');
  const [after, setAfter] = useState('');
  const [before, setBefore] = useState('');
  const [favorites, setFavorites] = useState(false);
  const [orderBy, setOrderBy] = useState('date.DESC');
  const [color, setColor] = useState('yellow'); // Default color set to "yellow"
  const [searchInItems, setSearchInItems] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotes  = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      navigate('/login');
      return;
    }

    let url = `http://localhost:5000/notes?query=${query}&orderBy=${orderBy}`;
    if (after) url += `&after=${after}`;
    if (before) url += `&before=${before}`;
    if (favorites) url += `&favorites=true`;
    if (color) url += `&color=${color}`;
    if (searchInItems) url += `&searchInItems=true`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
        }
        if (response.status === 400) {
          setError('Bad request. Please check the parameters.');
        }
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Error fetching notes.');
    }

    setLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setAfter('');
    setBefore('');
    setFavorites(false);
    setOrderBy('date.DESC');
    setColor('yellow'); // Reset color to default "yellow"
    setSearchInItems(false);
    setNotes([]);
    setError(null);
  };

  return (
    <Box p={4}>
      <Stack spacing={4} mb={4}>
        <FormControl>
          <FormLabel>Keresési érték</FormLabel>
          <Input
            placeholder="Kocsit venni..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>-tól</FormLabel>
          <Input
            type="date"
            value={after}
            onChange={(e) => setAfter(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>-ig</FormLabel>
          <Input
            type="date"
            value={before}
            onChange={(e) => setBefore(e.target.value)}
          />
        </FormControl>
        <Checkbox
          isChecked={favorites}
          onChange={(e) => setFavorites(e.target.checked)}
        >
          Csak kedvencek
        </Checkbox>
        <FormControl>
          <FormLabel>Rendezés</FormLabel>
          <Select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="date.DESC">Legfrisebb elől</option>
            <option value="date.ASC">Legrégebbi elől</option>
            <option value="name.ASC">Név szerint A-Z</option>
            <option value="name.DESC">Név szerint Z-A</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Szín</FormLabel>
          <Select
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="yellow">Sárga</option>
            <option value="green">Zöld</option>
            <option value="blue">Kék</option>
            <option value="red">Piros</option>
          </Select>
        </FormControl>
        <Stack direction="row" spacing={4}>
          <Button onClick={fetchNotes} margin="auto" colorScheme="green" width={200}>
            Keresés
          </Button>
          <Button onClick={handleClear} margin="auto" colorScheme="red" width={200}>
            Törlés
          </Button>
          <Button as={Link} to="/profil" margin="auto" colorScheme="blue" width={200}>
            Vissza
          </Button>
        </Stack>
      </Stack>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box>
        {notes.map((note) => (
          <Box key={note.id} mb={4} p={4} borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between" align="center">
              <Text fontSize="xl">{note.title}</Text>
              <Stack direction="row" spacing={2}>
                <EditNoteButton noteId={note.id} onClick={fetchNotes } />
                <DeleteNoteButton noteId={note.id} onClick={fetchNotes } />
              </Stack>
            </Flex>
            {note.isFavorite && (
              <Text as="span" color="yellow.500">★</Text>
            )}
            <Text mt={2} color="gray.500">
              Created: {new Date(note.creationDate).toLocaleDateString()}
            </Text>
            <Stack mt={4}>
              {note.items
                .filter((item: any) => item.label.includes(query))
                .map((item: any) => (
                  <Flex key={item.id} align="center" justify="space-between">
                    <Text textDecoration={item.isDone ? 'line-through' : 'none'}>
                      {item.label}
                    </Text>
                    {item.isDone && (
                      <Box as="span" color="gray.500" ml={2}>
                        (Done)
                      </Box>
                    )}
                  </Flex>
                ))}
            </Stack>
          </Box>
        ))}
      </Box>
      )}
    </Box>
  );
};

export default SearchNotes;
