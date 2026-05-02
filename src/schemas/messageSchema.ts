import {z} from "zod";

export const messageSchema = z.object({
    content:z
    .string()
    .min(10,'Message must be at least 10 characters long')
    .max(500,'Message must not exceed 500 characters')
})
//This validates if user input follows these rules 