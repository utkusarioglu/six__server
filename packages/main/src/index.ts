import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HTTP_PORT, ALLOWED_ORIGINS } from './config';
import helmet from 'helmet';
import morgan from 'morgan';
import { useAuth, checkAuth } from 'six__server__auth';
import { mockUsers } from 'six__server__mock-data';
import insecure from './routes/insecure';
import secure from './routes/secure';
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
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
useAuth(app);

app.use('/api', insecure);
app.use('/api/auth', checkAuth, secure);
app.use(fourOFour);

app.listen(HTTP_PORT, () => {
  console.log(`App started on: ${HTTP_PORT}`);
});

mockUsers();
