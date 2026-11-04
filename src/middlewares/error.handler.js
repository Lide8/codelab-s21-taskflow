export default function errorHandler(error, _req, res, _next) {
  if (error.payload) return res.status(error.status).json(error.payload);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ mensaje: 'JSON inválido' });
  if (error.type === 'entity.too.large') return res.status(413).json({ mensaje: 'Solicitud demasiado grande' });
  console.error('Error interno en el servidor');
  return res.status(500).json({ mensaje: 'Error interno en el servidor' });
}
