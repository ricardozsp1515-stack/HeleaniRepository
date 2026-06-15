import { Request, Response } from "express";
import { db } from '../db/connection';
import { pets } from "../db/schema/pets";
import { eq } from 'drizzle-orm';
//import { users } from "../db/schema/users";
import { pet_types } from "../db/schema/pet_types";

interface AuthenticatedUser {
    id: string;
    email: string;
}

export const get_user_pets = async (req: Request, res: Response) => {
    try {
        const authUser = (req as Request & { user?: AuthenticatedUser }).user;

        if (!authUser) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        const auth_user = authUser;

        const user_id = auth_user.id;

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

        const unique_pets = user_pets.filter(
            (row, index, self) => index === self.findIndex(r => r.id === row.id)
        );

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

        res.status(200).json({
            message: "Get user pets!",
            pets: array_pets,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const create_pet = async (req: Request, res: Response) => {

    try {
        const authUser = (req as Request & { user?: AuthenticatedUser }).user;

        if (!authUser) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        
        const { name, breed, age, pet_type_id } = req.body;
        const auth_user = authUser;

        const user_id = auth_user.id;

        const [new_pet] = await db
        
            .insert(pets)
            .values({
                name: name ?? null,
                breed: breed ?? null,
                age: age ?? null ,
                user_id: user_id,
                pet_type_id: pet_type_id ?? null,
            })
            .returning({
                id: pets.id,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                user_id: pets.user_id,
                pet_type_id: pets.pet_type_id,
            });

        res.status(201).json({
            message: "Pet created!",
            pet: new_pet,
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};