const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

// const DB = `${process.env.DATABASE_MONGO}`;
const DB = `${process.env.DATABASE}`;
console.log(DB);
mongoose
  .connect(
    `mongodb://admin:test1234@mongo:27019/cura
  `,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('DB connected Succesfully');
  });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app is up an running on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM SHUTTING DOWN GRACEFULLY ✌✌✌✌');
  server.close(() => {
    console.log('💣💣💣💣 process terminated');
  });
});
