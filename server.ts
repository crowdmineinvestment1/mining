import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// AI Studio dev server must run strictly on port 3000
const args = process.argv.slice(2);
const portArgIndex = args.indexOf('--port');
const port = portArgIndex !== -1 && args[portArgIndex + 1]
  ? Number(args[portArgIndex + 1])
  : 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// AI Customer Support Route
app.post('/api/support', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are "CrowdMine AI", the dedicated 24/7 AI Customer Support & Mining Operations Concierge for CrowdMine Investing.
CrowdMine Investing is an enterprise cloud mining and high-performance hashrate infrastructure platform managing immersion-cooled ASIC data centers in Iceland (geothermal), Quebec (hydro), and Scandinavia.

Key Information to assist users:
1. DEPOSITS: Users can fund their mining portfolio using Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tether (USDT), or Binance Coin (BNB). Users select their cryptocurrency in the Deposit section, copy their assigned deposit wallet address, transfer the funds, and submit the deposit confirmation notice. Deposits are verified on the blockchain and credited to their balance. Minimum deposit is $10 USD.
2. WITHDRAWALS: Users can withdraw their accumulated mining yields and balance to their bank account via standard wire transfer or to their crypto wallet. Minimum withdrawal is $1,000 USD. Standard network and wire processing fees are deducted directly from the transacted amount upon settlement, with processing typically completed within 24 to 48 business hours.
3. MINING HARDWARE: CrowdMine deploys industrial-grade ASIC and GPU clusters including the Antminer S21 Pro Hydro (110 TH/s), Antminer S19 Pro (12.5 TH/s), RTX 4090 Hydro Cluster (28 TH/s), and modular 40ft ASIC Hydro Containers (95 TH/s).
4. POOLS & DAILY YIELDS: Hashrates are allocated across major mining pools including F2Pool, Braiins Pool, Binance Pool, and Solo Mining. Yields are calculated automatically based on network difficulty and distributed daily every 24 hours.
5. SUSTAINABILITY & SECURITY: 100% renewable geothermal and hydro energy sources, 256-bit encryption, cold-storage custody, and 99.98% hardware uptime.

Always maintain a professional, helpful, reassuring, and enterprise-grade tone. Guide users clearly and concisely on how to use the platform, monitor their hashrates, and manage their portfolio.`;

    if (aiClient) {
      try {
        const chatContents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            chatContents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
        chatContents.push({
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: chatContents,
          config: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        });

        const reply = response.text || "Hello! Thank you for contacting CrowdMine Investing. How can I assist you with your cloud hashrates or account today?";
        return res.json({ reply });
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, using intelligent fallback:', geminiErr?.message);
      }
    }

    // Intelligent built-in fallback response engine
    const lower = message.toLowerCase();
    let reply = "Hello! Thank you for contacting CrowdMine Investing 24/7 Operations Desk. How can I assist you with your cloud hashrates, deposits, or account today?";

    if (lower.includes('deposit') || lower.includes('fund') || lower.includes('add money') || lower.includes('pay')) {
      reply = "To deposit funds into your CrowdMine account: Navigate to the 'Deposit' tab. Choose your preferred cryptocurrency (BTC, ETH, SOL, USDT, or BNB), copy your assigned destination wallet address, transfer the funds, and submit the deposit confirmation notice with the USD amount. Your balance will be credited as soon as network confirmations complete.";
    } else if (lower.includes('withdraw') || lower.includes('cash out') || lower.includes('bank') || lower.includes('wire')) {
      reply = "To withdraw your mining rewards: Go to the 'Withdraw' tab, enter your commercial receiving bank details (Account and 9-digit ABA Routing Number) or destination wallet. The minimum withdrawal is $1,000 USD. Standard wire processing fees are deducted directly upon execution, and funds are settled within 24 to 48 business hours.";
    } else if (lower.includes('hardware') || lower.includes('rig') || lower.includes('machine') || lower.includes('antminer')) {
      reply = "CrowdMine operates cutting-edge industrial hardware including Antminer S21 Pro Hydro (110 TH/s), Antminer S19 Pro (12.5 TH/s), RTX 4090 Hydro clusters (28 TH/s), and 40ft ASIC Hydro Containers (95 TH/s) running at an optimal 21.5 J/TH efficiency.";
    } else if (lower.includes('yield') || lower.includes('profit') || lower.includes('earn') || lower.includes('hashrate') || lower.includes('calculate')) {
      reply = "Daily yields are calculated based on your allocated hashrate and current network difficulty. For SHA-256 Bitcoin contracts, returns average approximately $0.078 per TH/s daily with automatic 24-hour payouts directly to your account balance.";
    } else if (lower.includes('pool') || lower.includes('f2pool') || lower.includes('braiins')) {
      reply = "You can route your compute power across top global pools including F2Pool (PPS+), Braiins Pool (FPPS), Binance Pool, or Solo Mining depending on your variance and payout preferences in the 'Pools & Strategy' tab.";
    }

    return res.json({ reply });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal support service error', details: err.message });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CrowdMine Enterprise Server running on port ${port}:`);
    console.log(`  ➜  Local:   http://localhost:${port}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${port}/`);
  });
}

startServer();
