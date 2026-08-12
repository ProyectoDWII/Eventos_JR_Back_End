import http from 'k6/http';
import { check, sleep } from 'k6';

// RE-03: Prueba de estrés en POST /api/client/applications
// Rampa de 0 a 200 VUs en 2 minutos para encontrar el punto de quiebre (breaking point)
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Rampa hasta 50 VUs
    { duration: '45s', target: 150 }, // Subida a 150 VUs
    { duration: '45s', target: 200 }, // Pico a 200 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Umbral para identificar degradación (> 2s)
    http_req_failed: ['rate<0.05'],    // Umbral de tasa de error (< 5%)
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Setup inicial: Obtiene un token válido de cliente antes de iniciar la carga
export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: __ENV.TEST_EMAIL || 'cliente@test.com',
      password: __ENV.TEST_PASSWORD || 'password123',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-load-test': 're01',
      },
    }
  );

  let token = '';
  try {
    const data = loginRes.json();
    token = data.data?.token || data.token || '';
  } catch (e) {
    console.error('⚠️ No se pudo obtener el token en setup.');
  }

  return { token };
}

export default function (data) {
  const url = `${BASE_URL}/api/client/applications`;

  const payload = JSON.stringify({
    eventDate: '2026-12-31T18:00:00.000Z',
    eventLocation: 'Salon Los Angeles',
    eventType: 'boda',
    package: null,
    services: [],
    message: 'Prueba de estres con k6',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
      'x-stress-test': 're03',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status es 201 o 200': (r) => r.status === 201 || r.status === 200,
    'tiempo de respuesta < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(0.5);
}
