import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import auth from '../middleware/auth.js';

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/ai/chat — proxied Claude call
router.post('/chat', auth, async (req, res) => {
  try {
    const { systemPrompt, messages, maxTokens = 2000 } = req.body;

    if (!systemPrompt || !messages?.length) {
      return res.status(400).json({ error: 'systemPrompt and messages are required' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    res.json({
      content: textContent,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Claude API error:', error);
    const message = error instanceof Anthropic.APIError
      ? `Claude API Error: ${error.message}`
      : 'Failed to communicate with Claude';
    res.status(502).json({ error: message });
  }
});

export default router;
