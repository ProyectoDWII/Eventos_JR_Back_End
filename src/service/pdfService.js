const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { formatCurrency, formatDate } = require('../utils/formatters');
const logger = require('../utils/logger');

/**
 * Genera un PDF de contrato y lo guarda en disco
 * @returns {string} ruta del archivo generado
 */
const generateContractPDF = async (contract) => {
  return new Promise((resolve, reject) => {
    try {
      const outputDir = path.join('uploads', 'pdfs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = `contrato-${contract._id}-${Date.now()}.pdf`;
      const filePath = path.join(outputDir, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Encabezado
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('EVENTOS JR', { align: 'center' })
        .fontSize(14)
        .font('Helvetica')
        .text('Fotografía Profesional de Eventos', { align: 'center' })
        .moveDown(2);

      // Título
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('CONTRATO DE SERVICIO', { align: 'center' })
        .moveDown(1);

      // Línea separadora
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

      // Datos del cliente
      doc.fontSize(12).font('Helvetica-Bold').text('DATOS DEL CLIENTE').moveDown(0.5);
      doc
        .font('Helvetica')
        .text(`Nombre: ${contract.client?.name || 'N/A'}`)
        .text(`Correo: ${contract.client?.email || 'N/A'}`)
        .text(`Teléfono: ${contract.client?.phone || 'N/A'}`)
        .moveDown(1);

      // Datos del evento
      doc.font('Helvetica-Bold').text('DATOS DEL EVENTO').moveDown(0.5);
      doc
        .font('Helvetica')
        .text(`Tipo de Evento: ${contract.eventType}`)
        .text(`Fecha: ${formatDate(contract.eventDate)}`)
        .text(`Ubicación: ${contract.eventLocation}`)
        .moveDown(1);

      // Servicios / Paquete
      doc.font('Helvetica-Bold').text('PAQUETE / SERVICIOS').moveDown(0.5);
      if (contract.package) {
        doc.font('Helvetica').text(`Paquete: ${contract.package?.name || 'N/A'}`);
      }
      if (contract.services && contract.services.length > 0) {
        doc.font('Helvetica').text('Servicios adicionales:');
        contract.services.forEach((s) => {
          doc.text(`  - ${s.name || s}`);
        });
      }
      doc.moveDown(1);

      // Precio
      doc.font('Helvetica-Bold').text('DETALLES DE PAGO').moveDown(0.5);
      doc
        .font('Helvetica')
        .text(`Precio Total: ${formatCurrency(contract.totalPrice)}`)
        .text(`Anticipo: ${formatCurrency(contract.deposit || 0)}`)
        .text(`Saldo Restante: ${formatCurrency(contract.totalPrice - (contract.deposit || 0))}`)
        .moveDown(1);

      // Notas
      if (contract.notes) {
        doc.font('Helvetica-Bold').text('NOTAS').moveDown(0.5);
        doc.font('Helvetica').text(contract.notes).moveDown(1);
      }

      // Firmas
      doc.moveDown(3);
      doc
        .font('Helvetica')
        .text('______________________________', { continued: true, width: 200 })
        .text('______________________________', { align: 'right' })
        .text('Firma del Cliente', { continued: true, width: 200 })
        .text('Firma Eventos JR', { align: 'right' });

      // Pie de página
      doc
        .fontSize(9)
        .moveDown(2)
        .text(`Generado el ${formatDate(new Date())}`, { align: 'center', color: 'gray' });

      doc.end();

      stream.on('finish', () => {
        logger.info(`PDF generado: ${filePath}`);
        resolve(`/uploads/pdfs/${filename}`);
      });

      stream.on('error', reject);
    } catch (error) {
      logger.error(`Error al generar PDF: ${error.message}`);
      reject(error);
    }
  });
};

module.exports = { generateContractPDF };
