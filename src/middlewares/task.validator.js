import { checkSchema } from 'express-validator';

export const taskRules = checkSchema({
  title: {
    trim: true,
    notEmpty: {
      errorMessage: 'El titulo es obligatorio',
    },
  },
  status: {
    trim:  true,
    isIn: {
      options: [['TODO', 'DONE']],
      errorMessage: 'El estado no es valido',
    },
  },
  project: {
    optional: true,
    trim: true,
    notEmpty: {
      errorMessage: 'El proyecto no es valido',
    },
  },
});