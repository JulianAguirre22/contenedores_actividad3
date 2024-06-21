const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');

// Configuración de MongoDB
const mongoUrl = 'mongodb://mongodb:27017/nodejs-db';

// Definición del esquema de chiste
const jokeSchema = new mongoose.Schema({
  id: String,
  joke: String,
  status: Number
});

// Creación del modelo de chiste
const Joke = mongoose.model('Joke', jokeSchema);

// Conexión a la base de datos
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Configuración de Express
const app = express();
const port = 3000;

// Ruta para mostrar el chiste actual
app.get('/', async (req, res) => {
  try {
    const latestJoke = await Joke.findOne().sort({ _id: -1 }).exec();
    res.json(latestJoke);
  } catch (error) {
    console.error('Error al obtener el chiste:', error);
    res.status(500).json({ error: 'Error al obtener el chiste' });
  }
});

// Función para obtener los chistes del API y guardarlos en MongoDB
async function getDadJokesFromAPI() {
  try {
    const response = await axios.get('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json'
      }
    });

    const jokeData = response.data;

    const newJoke = new Joke({
      id: jokeData.id,
      joke: jokeData.joke,
      status: jokeData.status
    });

    await newJoke.save();
    console.log(`Chiste guardado en la base de datos: ${jokeData.joke}`);
  } catch (error) {
    console.error('Error al obtener y guardar el chiste:', error);
  }
}

// Iniciar el servidor Express
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
  getDadJokesFromAPI();
});

