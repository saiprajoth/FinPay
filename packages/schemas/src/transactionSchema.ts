


import {z} from 'zod';

 const transactionSchema = z.object({
    amount : z.number(),
    recipientId : z.number(),
})

export default transactionSchema;