import http from 'k6/http';
import { check, sleep } from 'k6';

// RE-02: Activación del rate limiter de autenticación (authLimiter)
// 15 solicitudes consecutivas desde la misma IP en menos de 15 minutos
export const options = {
  vus: 1,
  iterations: 15,
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const iteration = __ITER + 1; // 1 a 15
  const url = `${BASE_URL}/api/auth/login`;

  const payload = JSON.stringify({
    email: __ENV.TEST_EMAIL || 'cliente@test.com',
    password: __ENV.TEST_PASSWORD || 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  if (iteration <= 10) {
    // Solicitudes 1 a 10: permitidas por el rate limiter (200 o 401 según credenciales)
    check(res, {
      [`[Req ${iteration}/15] Dentro de cuota (HTTP 200/401)`]: (r) => r.status === 200 || r.status === 401,
    });
  } else {
    // Solicitudes 11 a 15: bloqueadas con 429 Too Many Requests
    check(res, {
      [`[Req ${iteration}/15] Bloqueada por Rate Limiter (HTTP 429)`]: (r) => r.status === 429,
      [`[Req ${iteration}/15] Mensaje esperado recibido`]: (r) => {
        return r.body && r.body.includes('Demasiados intentos de inicio de sesión');
      },
    });
  }

  // Pequeña pausa entre solicitudes consecutivas
  sleep(0.3);
}
