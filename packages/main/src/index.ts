require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env'),
});
import express from 'express';
import { HTTP_PORT } from './config';
import { store } from 'six__server__store';

const app = express();
app.get('/', (_, res) => {
  res.send('hi');
});

app.listen(HTTP_PORT, () => {
  console.log(`App started on: ${HTTP_PORT} - ${store.value}`);
});
