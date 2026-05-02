import {z} from "zod";

export const messageSchema = z.object({
    content:z
    .string()
    .min(3,'Message must be at least 3 characters long')
    .max(500,'Message must not exceed 500 characters')
})
//This validates if user input follows these rules 