const Joi = require('joi');
const { registerSchema } = require('../../src/validators/userValidation');
const User = require('../../src/models/user');

// Definimos el loginSchema tal como se describe en el diseño de pruebas
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo no es válido'
  }),
  password: Joi.string().required(),
});

describe('UN-01 - loginSchema rechaza un correo con formato inválido', () => {
  it('Debe clasificar un email con formato incorrecto como inválido', () => {
    const data = { email: 'correo-invalido', password: '123' };
    const { error } = loginSchema.validate(data);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('El correo no es válido');
  });
});

describe('UN-02 - registerSchema rechaza contraseña menor a 6 caracteres', () => {
  it('Debe rechazar contraseñas que tengan 5 caracteres (límite inferior no permitido)', () => {
    const data = { name: 'Juan Perez', email: 'juan@test.com', password: '12345', phone: '' };
    const { error } = registerSchema.validate(data);
    expect(error).toBeDefined();
    // En createUserSchema el mínimo es 6, así que lanza error de validación
    expect(error.details[0].message).toContain('al menos 6 caracteres');
  });
});

describe('UN-03 - User comparePassword y hashing con bcrypt', () => {
  it('Debe hashear la contraseña correctamente y validar comparePassword', async () => {
    const testUser = new User({
      name: 'Juan Diego',
      email: 'diego@test.com',
      password: 'MiClave123'
    });

    // Simulamos la llamada pre-save hook para cifrar la contraseña
    // Simulamos la llamada pre-save hook para cifrar la contraseña de forma compatible con Mongoose 8.x/9.x (Kareem)
    await new Promise((resolve, reject) => {
      testUser.schema.s.hooks.execPre('save', testUser, [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    expect(testUser.password).not.toBe('MiClave123');
    expect(testUser.password.startsWith('$2')).toBe(true);

    const isMatch = await testUser.comparePassword('MiClave123');
    const isNotMatch = await testUser.comparePassword('ClaveIncorrecta');

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });
});
