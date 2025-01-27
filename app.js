const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');

const app = express();

// Підключення до MongoDB
mongoose.connect('mongodb://localhost/inventory', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Маршрути
const warehousesRouter = require('./routes/warehouses');
const itemsRouter = require('./routes/items');
const movementsRouter = require('./routes/movements');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
app.use('/warehouses', warehousesRouter);
app.use('/items', itemsRouter);
app.use('/movements', movementsRouter);
app.use('/auth', authRouter);
app.use('/users', auth, usersRouter); // Захищені маршрути для користувачів

// Підключення Swagger
require('./swagger')(app);

// Запуск сервера
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
