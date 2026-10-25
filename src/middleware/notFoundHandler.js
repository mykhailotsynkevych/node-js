// Це middleware підключається після всіх маршрутів.
// Якщо жоден маршрут не збігся, керування потрапить сюди.
// Ми відправляємо клієнту відповідь зі статусом 404 Not Found.

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};
