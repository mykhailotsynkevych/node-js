import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());// Middleware для парсингу JSON
app.use(cors());// Дозволяє запити з будь-яких джерел
//Логування допомагає відслідковувати, як працює застосунок: які запити надходять, які відповіді повертаються і скільки часу займає обробка.
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// Кореневий маршрут
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

// Перший маршрут NOTES
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Конкретний користувач за id
app.get('/notes/:noteId', (req, res) => {
  const { id_param } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${id_param}` });
});

// Маршрут для тестування middleware помилки
app.get("/test-error", (req, res) => {
  // Штучна помилка для прикладу
  throw new Error("Simulated server error");
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Middleware для обробки помилок (останнє)
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

