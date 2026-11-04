import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { loginRules, registerRules } from '../middlewares/auth.validator.js';
import { validateRequest } from '../middlewares/validate.request.js';
const router = Router();
router.post('/registro', registerRules, validateRequest, controller.register);
router.post('/login', loginRules, validateRequest, controller.login);
router.post('/logout', controller.logout);
export default router;
