// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Clerk middleware — verifies Authorization header with Bearer token
app.use(ClerkExpressWithAuth());

// Test endpoint to check authentication
app.get("/api/me", (req, res) => {
  if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

  const { userId, sessionId } = req.auth;
  res.json({ userId, sessionId });
});

// Example: receive assessment + GPS from frontend
app.post("/api/assessments", (req, res) => {
  if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

  const { userId } = req.auth;
  const { description, location } = req.body;

  // Temporary scoring / AI recommendation
  const riskScore = Math.round(Math.random() * 100);
  const aiRecommendation = riskScore > 60 ? "High risk — avoid area" : "Low risk — monitor";

  const record = { id: Date.now(), userId, description, location, riskScore, aiRecommendation };
  res.json({ success: true, record });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
