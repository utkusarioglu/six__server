import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HTTP_PORT, ALLOWED_ORIGINS, NODE_ENV } from 'six__server__global';
import helmet from 'helmet';
import morgan from 'morgan';
import { useAuth } from 'six__server__auth';
import { createMockData } from 'six__server__mock-data';
import comment from './routes/comment.routes';
import community from './routes/community.routes';
import post from './routes/post.routes';
import user from './routes/user.routes';
import fourOFour from './routes/404.routes';
import store from 'six__server__store';

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

// app.use('/files', express.static(path.join(__dirname, 'public')));
app.use('/api', comment);
app.use('/api', community);
app.use('/api', post);
app.use('/api', user);

app.use(fourOFour);

if (NODE_ENV !== 'production') {
  store.initStore().then(() => {
    if (NODE_ENV === 'development') {
      createMockData();
    }
  });
}

app.listen(HTTP_PORT, () => {
  console.log(`App started on: ${HTTP_PORT}`);
});
