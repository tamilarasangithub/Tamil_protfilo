import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import crypto from 'crypto';
import { auth } from './firebaseAdmin.js';

// Load environment variables from the root .env file
dotenv.config({ path: '../.env' });

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// 1. RATE LIMITING
// ---------------------------------------------------------
// General rate limiter for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Specific stricter rate limiter for the chat AI endpoint
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chat requests per minute
  message: 'Too many chat requests from this IP, please try again after a minute',
});

// ---------------------------------------------------------
// 2. INPUT VALIDATION & INJECTION PROTECTION (NoSQL/Command)
// ---------------------------------------------------------
// Using Zod to strictly validate incoming requests
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1).max(2000), // Prevent massive payload injection
    })
  ).max(20), // Max 20 messages in history
});

// ---------------------------------------------------------
// 3. PROMPT CACHING & HASHING
// ---------------------------------------------------------
const promptCache = new Map();

// Helper to hash prompt messages
function hashMessages(messages) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(messages));
  return hash.digest('hex');
}

// ---------------------------------------------------------
// 4. AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ---------------------------------------------------------
// This middleware verifies the Firebase ID token
export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Secure endpoint example (requires auth)
app.get('/api/admin/data', verifyAuth, (req, res) => {
  // Only authenticated users can reach this
  res.json({ data: 'Sensitive admin data', user: req.user.uid });
});

// Chat endpoint with caching, rate limiting, and validation
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    // 1. Validate Input (Injection protection)
    const parsedBody = chatRequestSchema.parse(req.body);
    const messages = parsedBody.messages;

    // 2. Hash and Check Cache
    const promptHash = hashMessages(messages);
    if (promptCache.has(promptHash)) {
      console.log('Cache hit for hash:', promptHash);
      return res.json({
        choices: [{ message: { content: promptCache.get(promptHash) } }],
        cached: true
      });
    }

    console.log('Cache miss. Calling OpenRouter API...');

    // 3. Call External API securely from Backend
    const apiKey = process.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // We use dynamic import for fetch if needed, but Node 18+ has global fetch
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Title': 'Xova AI Backend'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Error:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch from AI provider' });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    // 4. Save to Cache
    if (assistantMessage) {
      promptCache.set(promptHash, assistantMessage);
    }

    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input format', details: error.errors });
    }
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server if not imported as a module (useful for testing)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
