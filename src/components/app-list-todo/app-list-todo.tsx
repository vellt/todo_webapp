import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, Select, Button, Spinner, IconButton } from '@chakra-ui/react';
import { CheckIcon, StarIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';


const TaskListPage: React.FC = () => {
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderBy, setOrderBy] = useState<string>('date.DESC');
  const [error, setError] = useState<string | null>(null);

  const history = useNavigate(); // Inicializáljuk a useHistory hook-ot

  const fetchTaskLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`http://localhost:5000/notes?orderBy=${orderBy}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
        }
        if (response.status === 400) {
          setError('Bad request. Please check the orderBy parameter.');
        }
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data); // Debug log

      // Sorbarendezés a név szerinti rendezésnél
      if (orderBy === 'name.ASC') {
        data.forEach((task: any) => {
          task.items.sort((a: any, b: any) => a.label.localeCompare(b.label));
        });
      } else if (orderBy === 'name.DESC') {
        data.forEach((task: any) => {
          task.items.sort((a: any, b: any) => b.label.localeCompare(a.label));
        });
      }

      setTaskLists(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaskLists();
  }, [orderBy]);

  const toggleFavorite = (taskIndex: number, itemIndex: number) => {
    const updatedTaskLists = [...taskLists];
    updatedTaskLists[taskIndex].items[itemIndex].isFavorite = !updatedTaskLists[taskIndex].items[itemIndex].isFavorite;
    setTaskLists(updatedTaskLists);
  };

  const renderTasks = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) {
      return (
        <Text>No tasks available</Text>
      );
    }

    return (
      <Box mb={4}>
        {tasks.map((task, taskIndex) => (
          <Box key={task.name} bg={task.color} p={1} borderWidth="1px" borderRadius="lg">
            <Text fontSize="xl">{task.name}</Text>
            <Text textColor="black" mt={2}>{new Date(task.creationDate).toLocaleString()}</Text>
            <ul>
              {task.items.map((item: any, itemIndex: number) => (
                <ol key={item.id}>
                  <Text
                    textDecoration={item.isDone ? 'line-through' : 'none'}
                    color={item.isDone ? 'gray.500' : 'black'}
                    mt={2}
                  >
                    <IconButton
                      icon={<StarIcon />}
                      aria-label={item.isFavorite ? 'Favorite' : 'Not favorite'}
                      color={item.isFavorite ? 'black' : 'gray.500'}
                      onClick={() => toggleFavorite(taskIndex, itemIndex)}
                      variant="unstyled"
                      mt={2}
                    />
                    <IconButton
                      icon={<CheckIcon />}
                      aria-label={item.isDone ? 'Done' : 'Not done'}
                      colorScheme="black"
                      variant={item.isDone ? 'outline' : 'outline'}
                      mt={2}
                      margin={3}
                    />
                    {item.label}
                  </Text>
                </ol>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
    );
  };

  const handleBack = () => {
    history('/');
  };

  return (
    <Box p={5}>
      <HStack justifyContent="space-between" mb={5}>
        <Text fontSize="2xl">Teendőim</Text>
        <Select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          placeholder="Rendezés"
          width="200px"
        >
          <option value="date.ASC">Legfrissebb legelöl</option>
          <option value="date.DESC">Legrégebbi legelöl</option>
          <option value="name.ASC">Név szerint A-Z</option>
          <option value="name.DESC">Név szerint fordítva</option>
        </Select>
      </HStack>
      <Button onClick={fetchTaskLists} colorScheme="blue" mb={5} mr={3}>
        Listázás
      </Button>
      <Button onClick={handleBack} colorScheme="gray" mb={5} leftIcon={<ArrowBackIcon />}>
        Vissza
      </Button>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        renderTasks(taskLists)
      )}
    </Box>
  );
};

export default TaskListPage;
