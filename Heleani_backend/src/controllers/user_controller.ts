//imports
import e, { Request, Response } from "express";
import {db} from '../db/connection';
import { Authenticated_user } from "../middleware/auth_validation";

//import tables
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { images } from "../db/schema/images";
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
                //role_id: users.role_id,
                role_name: user_roles.name,
                name: users.name,
                email: users.email,
                password: users.password,
                image_url: images.url
                /*
                created_at: users.created_at,
                updated_at: users.updated_at
                */
            })
            .from(users)
            .innerJoin(images, eq(users.image_id, images.id))
            .leftJoin(user_roles, eq(users.role_id, user_roles.id))
        //2
        const array_users = results.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            role_name: row.role_name,
            image_url: row.image_url
            /*
            created_at: row.created_at,
            updated_at: row.updated_at
            */
        }));
        //3
        res.status(200).json(array_users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get user by id

/*
    
    In user profile, the user data suppose to be visible, to show user information, extract user id from the token 
    and search for this user data

*/

export const get_by_id = async (req:Request, res:Response) => {
    try {

        // Here use Authenticated_user interface to use property "user" 
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that the user is authenticated
        if (!auth_user ) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        // take auth_user id to search for it data
        const user_id = auth_user.id;
        
        // fetch data from the DB
        const results = await db
            .select({
                id: users.id,
                //role_id: users.role_id,
                role_name: user_roles.name,
                name: users.name,
                email: users.email,
                image_url: images.url
                //password: users.password,
                /*
                created_at: users.created_at,
                updated_at: users.updated_at
                */
            })
            .from(users)
            .leftJoin(user_roles, eq(users.role_id, user_roles.id))
            .innerJoin(images, eq(users.image_id, images.id))
        // search data from specific user
            .where(eq(users.id, user_id))
        
        // verify that this user has data
        if (!results.length) {
            return res.status(404).json({ message: "User not found" });
        }

        // convert results into an object
        const user = results[0];
        
        // return user
        res.status(200).json(user);
    
    // handle errors
    } catch (error) {
        console.error(error);
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
                //role_id: users.role_id,
                role_name: user_roles.name,
                name: users.name,
                email: users.email,
                image_url: images.url
                //password: users.password,
                /*
                created_at: users.created_at,
                updated_at: users.updated_at
                */
            })
            .from(users)
            .leftJoin(user_roles, eq(users.role_id, user_roles.id))
            .innerJoin(images, eq(users.image_id, images.id))
            .where(ilike(users.name, `%${name}%`))

        if (!results.length) {
            return res.status(404).json({ message: "Not user with this name" });
        }

        //4
        const array_users = results.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role_name: row.role_name,
            image_url: row.image_url
        }));
        //5
        res.status(200).json(array_users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// update user

/*
    
    1. Extract id from the token
    2. Extract Request body (modified fields)
    3. Search for a user with same id
    4. If exist update it data
    5. Notify that the data has been updated

*/
export const update_user = async (req:Request, res:Response) => {

    try {
        // Here use Authenticated_user interface to use property "user" 
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that the user is authenticated
        if (!auth_user ) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take auth_user id to search for it
        const user_id = auth_user.id;

        const { name, email, password, role_id } = req.body;

        /* 
            verify that the password exist, if doesnt exist declare it as undefined
            this is because, without this condition you would have to send the password and generally
            you wouldn't want to change it
        */
        const hashed_password = password? await hash_password(password) : undefined;

        const update_data: Record<string, any> = {
            name,
            email,
            role_id,
            updated_at: new Date()
        };

        // this condition serves to prevent the password from being entered as undefined

        if(hash_password != undefined){
            update_data.password= hashed_password;
        }

        // insert new data in correct user
        const updated_user = await db.update(users)
            .set(update_data)

            // search for user id
            .where(eq(users.id, user_id))
            .returning();

        // this condition serves to prevent internal errors if, for some reason, the user is authenticated but does not exist.
        if (!updated_user.length) {
            return res.status(404).json({ message: "User not found" });
        }

        // notify that the data has been updated
        res.status(200).json({message: 'User updated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete user

/*
    
    1. Extract id from token
    2. Search for some user with equal id
    3. If exist, delete it

*/

export const delete_user = async (req:Request, res:Response) => {

    try {

        // Here use Authenticated_user interface to use property "user" 
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that the user is authenticated
        if (!auth_user ) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take auth_user id to search for it
        const user_id = auth_user.id;
        //2, 3
        const deleted = await db.delete(users).where(eq(users.id, user_id)).returning();

        if (!deleted.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}