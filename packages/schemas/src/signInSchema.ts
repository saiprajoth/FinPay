import {z} from 'zod';
const signInSchema=z.object({
    email:z.email(),
    password:z.string()
})
export default signInSchema;