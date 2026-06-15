import { Router } from "express";
import { get_user_pets, create_pet } from "../controllers/pets_controller";
import { validate_token } from "../middleware/validations";
import { validateBody } from "../middleware/validations";
import { create_pet_schema } from "../zod_schemas/pet_schemas";

const router = Router();


router.get("/", validate_token, get_user_pets);


router.post("/", validate_token, validateBody(create_pet_schema), create_pet);

export default router;