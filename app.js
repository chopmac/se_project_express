const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const itemRouter = require('./routes/clothingItems');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(express.json());


app.use((req, res, next) => {
  req.user = {
    _id: '69d36d135118c825baaee8e9'
  };
  next();
});

app.use('/users', userRouter);
app.use('/items', itemRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});