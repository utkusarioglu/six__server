require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env'),
});
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HTTP_PORT, ALLOWED_ORIGINS } from './config';
import helmet from 'helmet';
import fourOFour from './routes/404';

const app = express();
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(fourOFour);

app.listen(HTTP_PORT, () => {
  console.log(`App started on: ${HTTP_PORT}`);
});
