// imports

//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';

// controller
import {get_all, get_by_id, get_by_name, update_user, delete_user} from '../controllers/user_controller'

// Zod validations

import { get_user_schema, get_user_by_name_schema, update_user_schema } from "../zod_schemas/user_schemas";

// create router
const router = Router();

// Get all users
router.get("/", get_all);

// Get user by id
router.get("/:id", validateParams(get_user_schema), get_by_id);

// Get user by name
router.get("/name/:name", validateParams(get_user_by_name_schema), get_by_name);

// put users
router.put("/:id", validateParams(get_user_schema), validateBody(update_user_schema), update_user);

// Delete user
router.delete("/:id", validateParams(get_user_schema), delete_user);

export default router;