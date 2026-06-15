import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string;
                iat?: number;
                exp?: number;
            };
            body?: {
                name?: string;
                breed?: string;
                age?: number;
                pet_type_id?: string;
            } & Request["body"];
        }
    }
}