import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.VITE_API_URL || 'http://localhost:8080';
const OPENAPI_URL = `${BACKEND_URL}/v3/api-docs`;

const USERNAME = 'developer';
const PASSWORD = 'swagger2026';

const OUTPUT_PATH = path.resolve(__dirname, '../openapi.json');

async function downloadOpenApiSpec() {
  console.log(`[OpenAPI] Lade API-Spezifikation herunter von: ${OPENAPI_URL}...`);

  const headers = new Headers();
  const authHeader = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
  headers.set('Authorization', authHeader);

  try {
    const response = await fetch(OPENAPI_URL, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status} (${response.statusText})`);
    }

    const spec = await response.json();
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(spec, null, 2), 'utf-8');
    
    console.log(`[OpenAPI] Spezifikation erfolgreich gespeichert unter: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('[OpenAPI] Fehler beim Abrufen der API-Spezifikation:', error.message);
    console.error('[OpenAPI] Stelle sicher, dass das Spring Boot Backend läuft und unter dem Port erreichbar ist.');
    process.exit(1);
  }
}

downloadOpenApiSpec();
