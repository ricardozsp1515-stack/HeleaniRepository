// imports

//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';
import { validate_token } from "../middleware/auth_validation";
// controller
import {get_all, get_by_id, get_by_name, update_user, delete_user} from '../controllers/user_controller'

// Zod validations

import { get_user_schema, get_user_by_name_schema, update_user_schema } from "../zod_schemas/user_schemas";

// create router
const router = Router();

// Get all users
router.get("/", validate_token, get_all);

// Get user by id
router.get("/get_user", validate_token, get_by_id);

// Get user by name
router.get("/name/:name", validate_token, validateParams(get_user_by_name_schema), get_by_name);

// put users
router.put("/", validate_token, validateBody(update_user_schema), update_user);

// Delete user
router.delete("/", validate_token, delete_user);

export default router;