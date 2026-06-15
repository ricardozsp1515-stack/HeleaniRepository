//imports
import e, { Request, Response } from "express";
import {db} from '../db/connection';

//import tables
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import {hash_password} from '../utils/passwords';
//db utils
import {eq, ilike} from 'drizzle-orm';

// Get all users function

/*
    
    1. Read users Data
    2. Convert it into array
    3. Respose with the array

*/

export const get_all = async (req:Request, res:Response) => {
    try {
        //1
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
        //2
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
        //3
        res.status(200).json(array_users);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get user by id

/*
    
    1. Extract id params
    2. Read users Data
    3. Search for some user with equal id
    4. Return user

*/

export const get_by_id = async (req:Request, res:Response) => {
    try {
        //1
        const id = String(req.params.id);
        //2
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
        //3
            .where(eq(users.id, id))

        if (!results.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        //4
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
}

// Get users by name

/*
    
    1. Extract name params
    2. Search for some user with equal name (Use ilike to UX, because you can search Ricardo, ricardo or RicArDO and results wont be affected)
    3. If anyone has this name, add it to "results"
    4. Convert results to Array
    5. Return array

*/

export const get_by_name = async (req:Request, res:Response) => {
    try {
        //1
        const name = String(req.params.name);

        //2, 3
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

        //4
        const array_users = results.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: {
                id: row.role_id,
                name: row.role_name
            },
            created_at: row.created_at,
            updated_at: row.updated_at
        }));
        //5
        res.status(200).json(array_users);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// update user

/*
    
    1. Extract id params
    2. Extract Request body (modified fields)
    3. Look for user with same id
    4. If exist update it data
    5. Return updated user

*/
export const update_user = async (req:Request, res:Response) => {

    try {
        //1
        const id = String(req.params.id);
        //2
        const { name, email, password, role_id } = req.body;
        const hashed_password = await hash_password(password);
        //3, 4
        const updatedUser = await db.update(users)
            .set({
                name,
                email,
                password: hashed_password,
                role_id,
                updated_at: new Date(),
            })
            .where(eq(users.id, id))
            .returning();

        if (!updatedUser.length) {
            return res.status(404).json({ message: "User not found" });
        }

        //5
        res.status(200).json({message: 'User updated'});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete user

/*
    
    1. Extract id params
    2. Search for some user with equal id
    3. If exist, delete it

*/

export const delete_user = async (req:Request, res:Response) => {

    try {

        //1
        const id = String(req.params.id);
        //2, 3
        const deleted = await db.delete(users).where(eq(users.id, id)).returning();

        if (!deleted.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}