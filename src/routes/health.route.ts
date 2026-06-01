import { Request, Response, Router } from "express";
import { processMessage } from "../services/chat.service";

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
})

router.post('/chat', async (req: Request, res: Response) => {
  const { sessionId, userMessage } = req.body;

  if (!sessionId || !userMessage) {
    res.status(400).json({ error: 'sessionId and userMessage are required' });
    return;
  }

  const response = await processMessage(sessionId, userMessage);
  res.json({ sessionId, response });
});

export default router;