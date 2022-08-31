require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ksh2g.mongodb.net/paging_log?retryWrites=true&w=majority`
    );

    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

app.use(cors());
app.get('/', (req, res) => res.send('Hello World!'));

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
