const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const port = 8005;

const questionService = process.env.QUESTIONS_GENERATOR_SERVICE_URL || 'http://localhost:8007';

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

var gameId = 0;


// Route for getting questions
app.get('/gameUnlimitedQuestions', async (req, res) => {
  try {
    console.log("Llegamos al nuevo servicio")
    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    console.log("Antes de incrementar: ", gameId)
    const questionGenerated = await axios.get(`${questionService}/questions?n_preguntas=${1}`);
    gameId = gameId + 1
    console.log("Despues de incrementar: ", gameId)
    res.json(questionGenerated.data);
  } catch (error) {
    // res.status(500).json({ message: error.message })
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => {
  console.error(`An error occurred: ${err}`);
  res.status(500).send(`An error occurred: ${err.message}`);
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Game Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
});

module.exports = server
