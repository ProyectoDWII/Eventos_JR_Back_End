/**
 * Servicio de noticias/novedades de Eventos JR
 * Devuelve noticias estáticas o del sistema
 */

const news = [
  {
    id: 1,
    title: 'Nuevo paquete de bodas disponible',
    body: 'Hemos lanzado un nuevo paquete Premium para bodas que incluye álbum físico y cobertura en video. ¡Consúltalo!',
    date: new Date('2024-06-01'),
    category: 'paquetes',
  },
  {
    id: 2,
    title: 'Descuentos especiales en septiembre',
    body: 'Durante el mes de septiembre ofrecemos un 15% de descuento en todos nuestros servicios de fotografía.',
    date: new Date('2024-08-20'),
    category: 'promociones',
  },
  {
    id: 3,
    title: 'Nuevas tecnologías de edición',
    body: 'Ahora contamos con software de edición de última generación para entregar fotos de aún mayor calidad.',
    date: new Date('2024-09-10'),
    category: 'novedades',
  },
];

/**
 * Obtener todas las noticias
 */
const getAllNews = () => {
  return news.sort((a, b) => b.date - a.date);
};

/**
 * Obtener noticias por categoría
 */
const getNewsByCategory = (category) => {
  return news.filter((n) => n.category === category);
};

/**
 * Obtener noticia por ID
 */
const getNewsById = (id) => {
  return news.find((n) => n.id === parseInt(id));
};

module.exports = { getAllNews, getNewsByCategory, getNewsById };
