const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');

const app = express();

mongoose.connect('mongodb://localhost/inventory', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

const warehousesRouter = require('./routes/warehouses');
const itemsRouter = require('./routes/items');
const movementsRouter = require('./routes/movements');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const requestsRouter = require('./routes/requests');

app.use('/warehouses', warehousesRouter);
app.use('/items', itemsRouter);
app.use('/movements', movementsRouter);
app.use('/auth', authRouter);
app.use('/users', auth, usersRouter);
app.use('/requests', requestsRouter);

require('./swagger')(app);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
