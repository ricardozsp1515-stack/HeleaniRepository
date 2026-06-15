//imports

//import zod utils
import { z } from 'zod';

// Zod validdations

// post pets
// Define types structure and use noempty to avoid undefined data
export const create_pet_schema = z.object({
    name: z.string().nonempty(),
    breed: z.string().nonempty(),
    age: z.string().nonempty(),
    pet_type_id: z.string().nonempty()
});

// get pet by id
// Nothing to say...
export const get_pet_schema = z.object({
    id: z.string().nonempty()
});

