# Mini Demo de Integracion Event-Driven

Este repositorio contiene una mini demo con Docker Compose que representa una integracion simple entre sistemas usando eventos.

## Servicios

- `producer`: representa el portal de citas. Expone una API HTTP y publica eventos.
- `consumer`: representa un sistema consumidor, como el ERP clinico.
- `broker`: Redis usado como broker simple para publicar y consumir eventos.

## Flujo de la demo

1. Un cliente envia una solicitud HTTP a `producer`.
2. `producer` publica el evento `appointment.created` en Redis.
3. `consumer` recibe el evento y lo procesa.

## Levantar la demo

Desde la raiz del repositorio:

```bash
docker compose up --build
```

La demo cumple con el requisito de correr con `docker compose up`.

## Probar el flujo

En otra terminal, enviar una cita:

### Opcion Bash

```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientName":"Ana Lopez","doctor":"Dra. Perez","datetime":"2026-03-02T10:00:00Z"}'
```

### Opcion PowerShell

```powershell
$body = @{
  patientName = "Ana Lopez"
  doctor = "Dra. Perez"
  datetime = "2026-03-02T10:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/appointments" `
  -ContentType "application/json" `
  -Body $body
```

## Evidencia esperada

### Respuesta HTTP

El servicio `producer` responde con estado publicado y el payload del evento:

```json
{
  "status": "published",
  "payload": {
    "eventType": "appointment.created"
  }
}
```

### Logs

En los logs de `producer` debe verse algo como:

```text
[PRODUCER] Published: { eventType: 'appointment.created', ... }
```

En los logs de `consumer` debe verse algo como:

```text
[CONSUMER] Received event: { eventType: 'appointment.created', ... }
[CONSUMER] Processing appointmentId=...
```

## Comandos utiles

Ver estado de servicios:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f producer consumer
```

Detener la demo:

```bash
docker compose down
```

## Relacion con la organizacion

- `producer` representa a **Portal MiCita**.
- `consumer` representa a **ERP SaludCore** u otro sistema interno.
- El patron aplicado es **event-driven**, para desacoplar al portal de los sistemas que consumen el evento.
