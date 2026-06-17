// imports

import { Router } from "express";
import { get_user_pets, create_pet } from "../controllers/pets_controller";
import { validate_token } from "../middleware/auth_validation";
import { validateBody } from "../middleware/validations";
import { create_pet_schema } from "../zod_schemas/pet_schemas";

const router = Router();

// get all user pets
router.get("/", validate_token, get_user_pets);

// post new pet
router.post("/", validate_token, validateBody(create_pet_schema), create_pet);

export default router;