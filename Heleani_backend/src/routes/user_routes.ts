// imports
import { Router } from "express";

import {validateBody, validateParams, validateQuery} from '../middleware/validations';
import {email, z} from 'zod';

import db from "../db/connection";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { eq, sql } from "drizzle-orm";

const create_user_schema = z.object({
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    password: z.string().nonempty(),
    role: z.string().nonempty()
})

const get_user_schema = z.object({
    id: z.string().nonempty()
})

const router = Router();

router.get("/", async (req, res) => {
    try{
        const results = await db
        .select ({
            id: users.id,
            role_id: users.role_id,
            role_name: user_roles.name,
            name: users.name,
            email: users.email,
            password: users.password,
            created_at: users.created_at,
            updated_at: users.updated_at
        })
        .from(users)
        .leftJoin(user_roles, eq(users.role_id, user_roles.id))

        const array_users = results.map (row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            role: {
                id: row.role_id,
                name: row.role_name
            },
            created_at: row.created_at,
            updated_at: row.updated_at
        }));

        res.status(200).json(array_users);

    }catch(error){
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/:id", (req, res) => {
    res.status(200).json({ message: `Details of user with id ${req.params.id}` });
});

router.post("/", (req, res) => {
    res.status(201).json({ message: "User created successfully" });
});

router.put("/:id", (req, res) => {
    res.status(200).json({ message: `User with id ${req.params.id} updated successfully` });
});

router.delete("/:id", (req, res) => {
    res.status(200).json({ message: `User with id ${req.params.id} deleted successfully` });
});

export default router;