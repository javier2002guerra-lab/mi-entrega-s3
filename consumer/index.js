import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const channel = "events.appointments";

const sub = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });

sub.on("error", (err) => console.error("Redis sub error:", err));

await sub.connect();

console.log(`[CONSUMER] Subscribed to channel: ${channel}`);

await sub.subscribe(channel, (message) => {
  try {
    const evt = JSON.parse(message);
    console.log("[CONSUMER] Received event:", evt);

    // “Procesamiento” simulado:
    // aquí podrías guardar en DB, llamar a ERP, actualizar BI, etc.
    console.log(`[CONSUMER] Processing appointmentId=${evt?.data?.appointmentId}`);
  } catch (e) {
    console.log("[CONSUMER] Invalid message:", message);
  }
});