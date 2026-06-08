import { Request, Response, NextFunction } from 'express';

import { z } from 'zod';

// Validations
export const validateBody = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        } catch (error) {
            handleZodError(res, error, "Validation failed");
            next(error);
        }
    }
}
//
export const validateParams = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            handleZodError(res, error, "Invalid params");
            next(error);
        }
    }
}
//
export const validateQuery = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            handleZodError(res, error, "Invalid query params");
            next(error);
        }
    }
}

// Every validations repeat same error code, to clean that, create a function to errors

function handleZodError(res: Response, error: unknown, message: string) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({
            message,
            errors: error.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }
}