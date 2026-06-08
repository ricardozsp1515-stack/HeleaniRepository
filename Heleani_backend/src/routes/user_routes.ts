// imports
import { Router } from "express";

import { validateBody, validateParams, validateQuery } from '../middleware/validations';
import { email, z } from 'zod';

import db from "../db/connection";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { eq, sql, ilike } from "drizzle-orm";

// Zod validdations
// Define types structure and use noempty to avoid undefined data
const create_user_schema = z.object({
    name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty(),
});

// Nothing to say...
const get_user_schema = z.object({
    id: z.string().nonempty()
});

const get_user_by_name_schema = z.object({
    name: z.string().nonempty()
});

// Use optional because may only one parameter will be updated, but use refine to force updated at least one
const update_user_schema = z.object({
    name: z.string().nonempty().optional(),
    email: z.email().nonempty().optional(),
    password: z.string().nonempty().optional(),
    role: z.string().nonempty().optional()
}).refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== ""),
    { message: "Updated body can't be empty" }
);

// create router
const router = Router();

// Get all users
router.get("/", async (req, res) => {
    try {
        const results = await db
            .select({
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

        const array_users = results.map(row => ({
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

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user by id
router.get("/:id", validateParams(get_user_schema), async (req, res) => {
    try {
        const id = String(req.params.id);

        const results = await db
            .select({
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
            .where(eq(users.id, id))

        if (!results.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: { id: user.role_id, name: user.role_name },
            created_at: user.created_at,
            updated_at: user.updated_at,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get user by name
router.get("/name/:name", validateParams(get_user_by_name_schema), async (req, res) => {
    try {
        const name = String(req.params.name);

        const results = await db
            .select({
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
            .where(ilike(users.name, `%${name}%`))

        if (!results.length) {
            return res.status(404).json({ message: "Not user with this name" });
        }

        const array_users = results.map(row => ({
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

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Post users
router.post("/", validateBody(create_user_schema), async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Define Regular role to create new users
        const roles = await db.select().from(user_roles);

        const role_id = roles.find(r => r.name === "Regular")?.id ?? roles[0].id;

        const new_user = await db.insert(users).values({
            name,
            email,
            password,
            role_id,
            created_at: new Date(),
            updated_at: new Date(),
        }).returning();

        res.status(201).json(new_user[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// put users
router.put("/:id", validateParams(get_user_schema), validateBody(update_user_schema), async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, email, password, role_id } = req.body;

        const updatedUser = await db.update(users)
            .set({
                name,
                email,
                password,
                role_id,
                updated_at: new Date(),
            })
            .where(eq(users.id, id))
            .returning();

        if (!updatedUser.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete user
router.delete("/:id", validateParams(get_user_schema), async (req, res) => {
    try {
        const id = String(req.params.id);

        const deleted = await db.delete(users).where(eq(users.id, id)).returning();

        if (!deleted.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;