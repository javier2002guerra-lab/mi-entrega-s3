import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const PORT = process.env.PORT || 3000;

const channel = "events.appointments";

const pub = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });

pub.on("error", (err) => console.error("Redis pub error:", err));

await pub.connect();

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/appointments", async (req, res) => {
  const payload = {
    eventType: "appointment.created",
    occurredAt: new Date().toISOString(),
    data: {
      appointmentId: crypto.randomUUID?.() || String(Date.now()),
      patientName: req.body?.patientName || "Paciente Demo",
      doctor: req.body?.doctor || "Dr. Rivera",
      datetime: req.body?.datetime || new Date(Date.now() + 3600000).toISOString()
    }
  };

  await pub.publish(channel, JSON.stringify(payload));
  console.log("[PRODUCER] Published:", payload);

  res.status(201).json({ status: "published", payload });
});

app.listen(PORT, () => {
  console.log(`[PRODUCER] Listening on http://localhost:${PORT}`);
  console.log(`[PRODUCER] Publishing to channel: ${channel}`);
});