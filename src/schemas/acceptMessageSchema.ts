import {z} from 'zod'

export const acceptingMsgVerificationSchema=z.object({
    isAcceptingMsg:z.boolean()
})


//Schemas define what kind of data is expected from user.