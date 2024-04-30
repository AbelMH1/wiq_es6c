// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar } from '@mui/material';
import Button from './Button';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    if (name.trim() === '' || lastName.trim() === '') {
      setError('Por favor, introduce tanto el nombre como los apellidos.');
    } else {
      try {
        await axios.post(`${apiEndpoint}/adduser`, { username, password });
        setOpenSnackbar(true);
      } catch (error) {
        setError(error.response.data.error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container className='addUser' component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      
      <Typography component="h1" variant="h5">
        Add User
      </Typography>

      <TextField
        name="name"
        margin="normal"
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        name="surname"
        margin="normal"
        fullWidth
        label="Surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />

      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        name="password"
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button text="Add user" onClick={addUser} name = "Add user"/>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}

    </Container>
  );
};

export default AddUser;
