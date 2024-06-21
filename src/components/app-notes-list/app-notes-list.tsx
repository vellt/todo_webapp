import React, { FC, useEffect, useState } from 'react';
import {
  Box, Input, Button, Stack, Checkbox, Select, Text,
  Flex, FormControl, FormLabel, Spinner,
  Collapse
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import EditNoteButton from '../app-notes/edit/editNoteButton';
import DeleteNoteButton from '../app-notes/delete/deleteNoteButton';
import './starStyle.css';
import NoteButton from '../app-notes/create/noteButton';
import TaskDelete from '../app-task-delete/app-task-delete';
import AuthService from '../../auth/auth-service';

const SearchNotes: FC = () => {
  const [query, setQuery] = useState('');
  const [after, setAfter] = useState('');
  const [before, setBefore] = useState('');
  const [favorites, setFavorites] = useState(false);
  const [orderBy, setOrderBy] = useState('date.DESC');
  const [color, setColor] = useState('all'); // Default color set to "all"
  const [searchInItems, setSearchInItems] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchNotes();
  }, []);


  const fetchNotes = async () => {

    let url = `${process.env.REACT_APP_API_URL}/notes?query=${query}&orderBy=${orderBy}`;
    if (after) url += `&after=${after}`;
    if (before) url += `&before=${before}`;
    if (favorites) url += `&favorites=true`;
    if (color !== 'all') url += `&color=${color}`;
    if (searchInItems) url += `&searchInItems=true`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
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
    setColor('all'); // Reset color to default "all"
    setSearchInItems(false);
    setNotes([]);
    setError(null);
  };


  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Box p={4}>
      <Button onClick={toggleSearch} marginBottom={4}>
        {isSearchOpen ? 'Keresés bezárása' : 'Keresés'}
      </Button>
      <Collapse in={isSearchOpen} animateOpacity>
        <Box mb={4} p={4} borderWidth="1px" borderRadius="lg">
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
            <option value="date.DESC">Legfrissebb elől</option>
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
            <option value="all">Összes</option>
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
          <Button onClick={handleClear} margin="auto" colorScheme="red" width={300}>
            Keresési értékek visszaállítása
          </Button>
        </Stack>
      </Stack>
        </Box>
      </Collapse>
      
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box mb={4} p={4} borderWidth="1px" borderRadius="lg" >
          <Box  marginBottom={5}>
              <NoteButton onClick={fetchNotes}/>
          </Box>
          <Box>
          {notes.map((note) => (
            <Box key={note.id} mb={4} p={4} borderWidth="1px" color="black" borderRadius="lg" bg={note.color}>
              <Flex justify="space-between" align="center">
                <Text fontSize="xl">{note.title}</Text>
                <Stack direction="row" spacing={2}>
                  <EditNoteButton noteId={note.id} onClick={fetchNotes} />
                  <DeleteNoteButton noteId={note.id} onClick={fetchNotes} />
                </Stack>
              </Flex>
              {note.isFavorite ? (
                <div className="full-star">★</div>
              ) : (
                <div className="outline-star">★</div>
              )}
              <Text mt={2} color="gray.500">
                Created: {new Date(note.creationDate).toLocaleDateString()}
              </Text>
              <Stack mt={4}>
                {note.items
                  .filter((item: any) => item.label.includes(query))
                  .map((item: any) => (
                    <Flex key={item.id} align="center" justify="space-between">
                      <Stack>
                      <Text textDecoration={item.isDone ? 'line-through' : 'none'}>
                        {item.label}
                      </Text>
                      <TaskDelete taskid={item.id} notesid={note.id} onClick={fetchNotes}/>
                      </Stack>
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
        </Box>
      )}
    </Box>
  );
};

export default SearchNotes;
