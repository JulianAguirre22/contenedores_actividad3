const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://mongodb:27017/chistesDB'; // Cambia esto si tu configuración de MongoDB es diferente

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

const jokeSchema = new mongoose.Schema({
    id: Number,
    type: String,
    setup: String,
    punchline: String,
});
const Joke = mongoose.model('Joke', jokeSchema);

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        const chiste = response.data;

        // Guarda el chiste en la base de datos
        const newJoke = new Joke(chiste);
        await newJoke.save();

        res.json(chiste);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener o guardar el chiste' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
