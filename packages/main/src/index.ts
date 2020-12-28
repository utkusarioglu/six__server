require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env'),
});
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HTTP_PORT, ALLOWED_ORIGINS } from './config';

const app = express();
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(HTTP_PORT, () => {
  console.log(`App started on: ${HTTP_PORT}`);
});
