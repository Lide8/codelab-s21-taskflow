import registerUser from '../useCases/register-user.use-case.js';
import loginUser from '../useCases/login-user.use-case.js';
import logoutUser from '../useCases/logout-user.use-case.js';
const handle = (operation, status) => async (req, res, next) => {
  try { res.status(status).json(await operation(req.body)); } catch (error) { next(error); }
};
export const register = handle(registerUser, 201);
export const login = handle(loginUser, 200);
export const logout = handle(logoutUser, 200);
