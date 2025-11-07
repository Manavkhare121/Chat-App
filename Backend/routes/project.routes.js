import { Router } from 'express';
import { body } from 'express-validator';
import { createproject, getAllProject, addUserToProject,getProjectById} from '../controllers/project.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/create',
  authMiddleware.authUser,
  body('name').isString().withMessage('Name is required'),
  createproject
);

router.get('/all', authMiddleware.authUser, getAllProject);

router.put(
  '/add-user',
  authMiddleware.authUser,
  body('users')
    .isArray({ min: 1 })
    .withMessage('Users must be an array of strings')
    .bail()
    .custom((users) => users.every((user) => typeof user === 'string')),
  addUserToProject
);

router.get('/get-project/:projectId',authMiddleware.authUser,getProjectById)

export default router;
