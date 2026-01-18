import z, { email } from 'zod';

import { usernameSchema } from './signupSchema';
export const signInSchema = z.object({
    identifier:z.union([usernameSchema,z.email()]),
    password:z.string().min(2,'password should be atleast of 2 characters').max(12,'password can be atmost of 12 characters')

})