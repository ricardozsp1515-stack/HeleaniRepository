// imports

import { Router } from "express";
import { get_user_pets, create_pet, get_pet_by_name, update_pet, delete_pet} from "../controllers/pets_controller";
import { validate_token } from "../middleware/auth_validation";
import { validateBody, validateParams } from "../middleware/validations";
import { create_pet_schema, update_pet_schema, get_pet_schema, get_pet_by_name_schema} from "../zod_schemas/pet_schemas";

const router = Router();

// get all user pets
router.get("/", validate_token, get_user_pets);

// post new pet
router.post("/", validate_token, validateBody(create_pet_schema), create_pet);

// get pets by name
router.get("/name/:name", validate_token, validateParams(get_pet_by_name_schema), get_pet_by_name);

// update pets
router.put("/:id", validate_token, validateParams(get_pet_schema), validateBody(update_pet_schema), update_pet);

// delete pets
router.delete("/:id", validate_token, validateParams(get_pet_schema), delete_pet)

export default router;