import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de carga (RE-01)
export const options = {
  vus: 10,            // 10 Usuarios Virtuales (VUs) constantes
  duration: '1m',     // Duración de 1 minuto
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben responder en < 500ms
    http_req_failed: ['rate<0.01'],    // Menos del 1% de tasa de errores
  },
};

export default function () {
  const url = 'http://localhost:3000/api/auth/login';
  
  // Cambia estas credenciales por las de un usuario válido en tu base de datos local
  const payload = JSON.stringify({
    email: 'admin@eventosjr.com',
    password: 'Password123!', 
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Enviar petición POST
  const res = http.post(url, payload, params);

  // Validaciones
  check(res, {
    'status es 200 o 401': (r) => r.status === 200 || r.status === 401,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // Espera de 1 segundo entre iteraciones por usuario
}
