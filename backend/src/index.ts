import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/models', chatRouter);

app.get('/', (req, res) => {
  res.send('AI Agent Dashboard Backend');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
