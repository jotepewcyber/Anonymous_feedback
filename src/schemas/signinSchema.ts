import {z} from 'zod'

export const signInVerificationSchema=z.object({
    identifier:z.string(),
    password:z.string()
})