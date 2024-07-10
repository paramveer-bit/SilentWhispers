import {z} from 'zod';


export const messageSchema = z.object({
    content : z
        .string()
        .min(10,{message : "Message must be at least 10 character long"})
        .max(400,{message : "Message must be at most 1000 character long"})
}) 
