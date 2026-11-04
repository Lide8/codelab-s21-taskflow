import { validationResult } from 'express-validator';
export const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errores = result.array().map(({ path, msg, location }) => ({ path, msg, location }));
    return res.status(400).json({ mensaje: 'Datos invalidos', errores });
  }
  next();
};
