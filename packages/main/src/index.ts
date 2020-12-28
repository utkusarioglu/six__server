require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env'),
});
import express from 'express';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: 'http://192.168.1.152',
  })
);

app.listen(HTTP_PORT, () => {
  console.log(`App started on: ${HTTP_PORT} - ${store.value}`);
});
