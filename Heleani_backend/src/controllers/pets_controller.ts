// imports
import { Request, Response } from "express";
import { db } from '../db/connection';
import { pets } from "../db/schema/pets";
import { eq, and, ilike } from 'drizzle-orm';
import { pet_types } from "../db/schema/pet_types";
import { images } from "../db/schema/images";
import type { Authenticated_user } from "../middleware/auth_validation";


// get user pets

/* 
    In user profile, all pets supposed to be visible, for that this function will take user data with the auth token and search for
    all pets of provided user
*/

export const get_user_pets = async (req: Request, res: Response) => {
    try {

        // Here use Authenticated_user interface to use property "user" 
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        // load pets data
        const user_pets = await db
            .select({
                id: pets.id,
                user_id: pets.user_id,
                //pet_type_id: pets.pet_type_id,
                pet_type_name: pet_types.name,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                image_url: images.url
                /*
                created_at: pets.created_at,
                updated_at: pets.updated_at
                */
            })
            .from(pets)
            .innerJoin(pet_types, eq(pets.pet_type_id, pet_types.id))
            .innerJoin(images, eq(pets.image_id, images.id))
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
            pet_type_name: row.pet_type_name,
            image_url: row.image_url
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

// create pet function
export const create_pet = async (req: Request, res: Response) => {

    try {
        // Here use Authenticated_user interface to use user
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take new pet data
        const { name, breed, age, pet_type_id } = req.body;

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        //search for corresponding image
        const [matched_image] = await db
            .select({ image_id: images.id })
            .from(pet_types)
            .innerJoin(images, eq(images.name, pet_types.name))
            .where(eq(pet_types.id, pet_type_id));

        const image_id = matched_image?.image_id ?? null;

        // insert data in the DB
        const [new_pet] = await db

            .insert(pets)
            .values({
                name: name,
                breed: breed,
                age: age,
                user_id: user_id,
                pet_type_id: pet_type_id,
                image_id: image_id
            })
            .returning({
                id: pets.id,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                user_id: pets.user_id,
                pet_type_id: pets.pet_type_id,
                image_id: pets.image_id
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

// get pet by name

/* 
    generally users dont register more than 3 pets, but for some reason, the user has to many
    pets, their can be searched with name
*/

export const get_pet_by_name = async (req: Request, res: Response) => {

    try {
        // Here use Authenticated_user interface to use user
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        // take pet id
        const pet_name = String(req.params.name);

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents that pets of other users appears in wrong profile
        */
        const results = await db
            .select({
                id: pets.id,
                user_id: pets.user_id,
                //pet_type_id: pets.pet_type_id,
                pet_type_name: pet_types.name,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                image_url: images.url
                /*
                created_at: pets.created_at,
                updated_at: pets.updated_at
                */
            })
            .from(pets)
            .innerJoin(pet_types, eq(pets.pet_type_id, pet_types.id))
            .innerJoin(images, eq(pets.image_id, images.id))
            .where(and(ilike(pets.name, `%${pet_name}%`), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!results.length) {
            return res.status(404).json({ message: "Not pet with this name" });
        }

        // convert db data in a array
        const array_pets = results.map(row => ({
            id: row.id,
            name: row.name,
            breed: row.breed,
            age: row.age,
            pet_type_name: row.pet_type_name,
            image_url: row.image_url
        }));

        // return array
        res.status(200).json(array_pets);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

// update pet function

/* 
    The user will enter updated pet data and this function will insert the data into
    corresponding pets record, to do this, the users ID is extracted from the token to 
    search for their pets. Then the pets id is obtained from params, the request body is 
    retrieved to obtain the new data, and this data is inserted into the corresponding pet's record
*/
export const update_pet = async (req: Request, res: Response) => {

    try {
        // Here use Authenticated_user interface to use user
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        // take pet id
        const pet_id = String(req.params.id);

        // take updated pet data
        const { name, breed, age, pet_type_id } = req.body;

        // create an object with updated data
        const update_data: Record<string, any> = {
            name,
            breed,
            age,
            pet_type_id,
            updated_at: new Date()
        };

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents a user who knows other users pet IDs from updating their data
        */
        const [pet] = await db
            .select()
            .from(pets)
            .where(and(eq(pets.id, pet_id), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!pet) {
            return res.status(404).json({ message: "The pet is not registered" });
        }

        // insert new data in corresponding pet
        const updated_pet = await db.update(pets)
            .set(update_data)

            // search for pet id
            .where(eq(pets.id, pet_id))
            .returning();

        // this condition serves to prevent internal errors if, for some reason, the pets id matches with users id but does not exist.
        if (!updated_pet.length) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // notify that the data has been updated
        res.status(200).json({ message: 'Pet updated' });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

// update pet function

/* 
    The user will for some reason may want to erase a pet from their profile, for that
    extract user id from the token, and pet id from params, search for pet with same id
    and remove it from db
*/
export const delete_pet = async (req: Request, res: Response) => {

    try {
        // Here use Authenticated_user interface to use user
        const auth_user = (req as Request & { user?: Authenticated_user }).user;

        // firts validate that user exist
        if (!auth_user) {
            return res.status(401).json({ message: "Unauthenticated user" });
        }

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        // take pet id
        const pet_id = String(req.params.id);

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents a user who knows other users pet IDs from deleting their data
        */
        const [pet] = await db
            .select()
            .from(pets)
            .where(and(eq(pets.id, pet_id), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!pet) {
            return res.status(404).json({ message: "The pet is not registered" });
        }

        const deleted = await db.delete(pets).where(eq(pets.id, pet_id)).returning();

        if (!deleted.length) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({ message: "Pet deleted successfully" });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}
