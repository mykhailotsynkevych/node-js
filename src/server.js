//L1 Express.js and basic middleware setup
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
//L2 MongoDB and models
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import studentsRoutes from './routes/studentsRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

//Logger першим → логуються всі вхідні запити.
// JSON і CORS далі → кожен запит обробляється перед передачею в маршрути.
// Маршрути → відповідають на конкретні запити.
// 404 handler → якщо маршрут не знайдено.
// Error handler → якщо трапилась помилка на будь-якому етапі.

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);// 1. Логер першим — бачить усі запити
app.use(express.json()); // Middleware для парсингу JSON
app.use(cors()); // Дозволяє запити з будь-яких джерел

// Кореневий маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// L2 MongoDB - create basic routes for students as an example
app.use(studentsRoutes);// підключаємо групу маршрутів студента

//L1 exress.js - create basic routes for notes as an example
app.use(notesRoutes); // підключаємо групу маршрутів нотаток

//BASE SETTINGS

// Маршрут для тестування middleware помилки
app.get('/test-error', (req, res) => {
  // Штучна помилка для прикладу
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware для обробки помилок (останнє)
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
