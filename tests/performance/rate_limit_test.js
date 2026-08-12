const url = 'http://localhost:3000/api/auth/login';

async function runTest() {
  console.log('Iniciando prueba de Rate Limiting (15 solicitudes secuenciales)...');
  
  for (let i = 1; i <= 15; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@usuario.com',
          password: 'Password123!'
        })
      });

      // Intentar parsear a JSON, si no, mostrar texto plano
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = { message: await response.text() };
      }

      console.log(`Petición #${i} - Status: ${response.status} - Mensaje: ${data.message || 'Sin mensaje'}`);

      if (i > 10) {
        if (response.status === 429) {
          console.log(`✅ Petición #${i} bloqueada correctamente por el Rate Limiter (429).`);
        } else {
          console.log(`❌ ALERTA: La petición #${i} no fue bloqueada. Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`Error en la petición #${i}:`, error.message);
    }
    // Pequeña espera para peticiones secuenciales
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

runTest();
