import { Router } from 'express';

const router = Router();

router.post('/chat', (req, res) => {
  const { message, model } = req.body;
  const response = `This is a simulated response from the backend using ${model}. You said: "${message}"`;
  res.json({ response });
});

export default router;
