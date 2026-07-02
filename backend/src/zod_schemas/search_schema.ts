//imports

//import zod utils
import { z } from 'zod';

// search schema
// La busqueda global se hace por query param ?q=, se valida que exista
// y no sea un string vacio (evita hacer ILIKE '%%' que traeria todo)
export const search_query_schema = z.object({
    q: z.string().nonempty()
});