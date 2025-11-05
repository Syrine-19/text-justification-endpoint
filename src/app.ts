import express, { Express } from 'express';
import routes from './routes';

const app: Express = express();

app.use(express.text({ type: 'text/plain' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/api');
});

app.use('/api', routes);

export default app;

