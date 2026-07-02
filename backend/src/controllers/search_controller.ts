// imports
import { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../db/connection";

// table imports
import { users } from "../db/schema/users";
import { pets } from "../db/schema/pets";
import { veterinarian } from "../db/schema/veterinarian";
import { veterinary_center } from "../db/schema/veterinary_center";
import { images } from "../db/schema/images";

// global search function

/*
    La barra de busqueda permite encontrar, por nombre, cualquier usuario, mascota,
    veterinario o clinica registrada en el sistema. Cada tipo de entidad se busca por
    separado (en paralelo) y luego se combinan los resultados en un solo arreglo, cada
    uno marcado con un campo "type" para que el frontend sepa a que perfil dirigir al
    usuario cuando le de click a la card correspondiente.

    Al igual que los perfiles de veterinarios y clinicas, los resultados de busqueda son
    visibles para cualquier usuario autenticado, sin importar si le pertenecen o no; la
    restriccion de dueño solo aplica a la hora de editar o eliminar, no de visualizar.
*/
export const global_search = async (req: Request, res: Response) => {
    try {
        // take search term
        const term = String(req.query.q);
        const like_term = `%${term}%`;

        // run the 4 searches in parallel
        const [user_results, pet_results, vet_results, center_results] = await Promise.all([
            // users, matched by their own name
            db
                .select({
                    id: users.id,
                    name: users.name,
                    image_url: images.url,
                })
                .from(users)
                .innerJoin(images, eq(users.image_id, images.id))
                .where(ilike(users.name, like_term)),

            // pets, matched by the pet's own name
            db
                .select({
                    id: pets.id,
                    name: pets.name,
                    image_url: images.url,
                })
                .from(pets)
                .innerJoin(images, eq(pets.image_id, images.id))
                .where(ilike(pets.name, like_term)),

            // veterinarians, matched by the name of the person behind the profile
            db
                .select({
                    id: veterinarian.id,
                    name: users.name,
                    image_url: images.url,
                })
                .from(veterinarian)
                .innerJoin(users, eq(veterinarian.user_id, users.id))
                .innerJoin(images, eq(users.image_id, images.id))
                .where(ilike(users.name, like_term)),

            // veterinary centers, matched by the clinic's own name
            db
                .select({
                    id: veterinary_center.id,
                    name: veterinary_center.name,
                    image_url: images.url,
                })
                .from(veterinary_center)
                .innerJoin(images, eq(veterinary_center.image_id, images.id))
                .where(ilike(veterinary_center.name, like_term)),
        ]);

        // combine every result type into a single array, tagging each row with its type
        const combined = [
            ...user_results.map((row) => ({ ...row, type: "user" as const })),
            ...pet_results.map((row) => ({ ...row, type: "pet" as const })),
            ...vet_results.map((row) => ({ ...row, type: "veterinarian" as const })),
            ...center_results.map((row) => ({ ...row, type: "veterinary_center" as const })),
        ];

        // if nothing matched in any of the 4 tables
        if (!combined.length) {
            return res.status(404).json({ message: "No results found" });
        }

        // return combined results
        res.status(200).json(combined);

        // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};