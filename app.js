const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const userRouter = require('./routes/users');
const itemRouter = require('./routes/clothingItems');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);



app.use('/users', userRouter);
app.use('/items', itemRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});