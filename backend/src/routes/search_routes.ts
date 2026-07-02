//router
import { Router } from "express";

//middleware validations
import { validateQuery } from "../middleware/validations";
import { validate_token } from "../middleware/auth_validation";

//controller
import { global_search } from "../controllers/search_controller";

// Zod validations
import { search_query_schema } from "../zod_schemas/search_schema";

const router = Router();

// global search by name across users, pets, veterinarians and veterinary centers
router.get("/", validate_token, validateQuery(search_query_schema), global_search);

export default router;