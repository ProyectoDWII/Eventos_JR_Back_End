import http from 'k6/http';
import { check, sleep } from 'k6';

// RE-01: Carga normal en POST /api/auth/login
// 10 usuarios virtuales (VUs) constantes durante 1 minuto
export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500'], // Tiempo de respuesta p95 menor a 500 ms
    http_req_failed: ['rate<0.01'],   // 0% de tasa de error (tolerancia < 1%)
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const url = `${BASE_URL}/api/auth/login`;
  
  const payload = JSON.stringify({
    email: __ENV.TEST_EMAIL || 'cliente@test.com',
    password: __ENV.TEST_PASSWORD || 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-load-test': 're01',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
    'retorna token': (r) => {
      try {
        const body = r.json();
        return (body.data && body.data.token) || body.token !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}
