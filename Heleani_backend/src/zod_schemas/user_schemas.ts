//imports

//import zod utils
import { email, z } from 'zod';

// Zod validdations

// Register, post
// Define types structure and use noempty to avoid undefined data
export const create_user_schema = z.object({
    name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty(),
});

// get user by id
// Nothing to say...
export const get_user_schema = z.object({
    id: z.string().nonempty()
});

//get user by name
export const get_user_by_name_schema = z.object({
    name: z.string().nonempty()
});

// update user
// Use optional because may only one parameter will be updated, but use refine to force updated at least one
export const update_user_schema = z.object({
    name: z.string().nonempty().optional(),
    email: z.email().nonempty().optional(),
    password: z.string().nonempty().optional(),
    role: z.string().nonempty().optional()
}).refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== ""),
    { message: "Updated body can't be empty" }
);

//login
export const login_user_schema = z.object({
    email: z.email().nonempty(),
    password: z.string().nonempty(),
});
