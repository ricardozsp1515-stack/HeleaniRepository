import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { jwtVerify } from "jose";
import env from "../../env"

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

//
interface TokenPayload {
    id: string;
    email: string;
}

export const validate_token = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

        const { payload } = await jwtVerify(token, secretKey);
        const data = payload as unknown as TokenPayload;;

        (req as Request & { user: TokenPayload }).user = {
            id: data.id,
            email: data.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
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