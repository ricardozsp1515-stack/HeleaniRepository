// imports
import { Request, Response } from "express";
import { db } from '../db/connection';
import { pets } from "../db/schema/pets";
import { eq } from 'drizzle-orm';
import { pet_types } from "../db/schema/pet_types";
import type { Authenticated_user } from "../middleware/auth_validation";


// get user pets

/* 
    In user profile, all pets supposed to be visible, for that this function will take user data with the auth token and search for
    all pets of provided user
*/

export const get_user_pets = async (req: Request, res: Response) => {
    try {

        // Here use Authenticated_user interface to use user
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user ) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        // take auth_user id to search for it pets
        const user_id = auth_user.id;
        
        // load pets data
        const user_pets = await db
            .select({
                id: pets.id,
                user_id: pets.user_id,
                pet_type_id: pets.pet_type_id,
                pet_type_name: pet_types.name,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                created_at: pets.created_at,
                updated_at: pets.updated_at
            })
            .from(pets)
            .innerJoin(pet_types, eq(pets.pet_type_id, pet_types.id))
            .where(eq(pets.user_id, user_id))
        
        // If you request for more than one user, the respone will duplicate, for avoid that this const specify only one object for one pet
        const unique_pets = user_pets.filter(
            (row, index, self) => index === self.findIndex(r => r.id === row.id)
        );

        // convert data to array to use that in front
        const array_pets = unique_pets.map(row => ({
            id: row.id,
            name: row.name,
            breed: row.breed,
            age: row.age,
            type: {
                id: row.pet_type_id,
                name: row.pet_type_name,
            },
        }));

        // return array
        res.status(200).json({
            message: "Get user pets!",
            pets: array_pets,
        }); 

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};


export const create_pet = async (req: Request, res: Response) => {

    try {
        // Here use Authenticated_user interface to use user
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        
        // take new pet data
        const { name, breed, age, pet_type_id } = req.body;

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        // insert data in the DB
        const [new_pet] = await db
        
            .insert(pets)
            .values({
                name: name,
                breed: breed,
                age: age,
                user_id: user_id,
                pet_type_id: pet_type_id,
            })
            .returning({
                id: pets.id,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                user_id: pets.user_id,
                pet_type_id: pets.pet_type_id,
            });

        // Notify that the pet was succesfully created
        res.status(201).json({
            message: "Pet created!"
        });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

// update pet function

/* 

*/
export const update_pet = async (req: Request, res: Response) => {}

    

