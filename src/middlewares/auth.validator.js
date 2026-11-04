import { body } from 'express-validator';
const emailRule = () => body('email').isString().bail().trim().isEmail().withMessage('El email no es válido').bail().toLowerCase();
const passwordRule = () => body('password').isString().withMessage('La contraseña debe ser texto').bail().isLength({ min: 8, max: 1024 }).withMessage('La contraseña debe tener entre 8 y 1024 caracteres');
export const registerRules = [body('name').isString().withMessage('El nombre debe ser texto').bail().trim().notEmpty().withMessage('El nombre es obligatorio'), emailRule(), passwordRule()];
export const loginRules = [emailRule(), passwordRule()];
