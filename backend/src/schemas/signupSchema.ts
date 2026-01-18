import z, { email } from 'zod';

export const usernameSchema = z.string().min(2,'username should have atleast 2 characters').max(12,'username should have atmost 12 characters');
export const signUpSchema = z.object({
    username:usernameSchema,
    email:z.email(),
    password:z.string().min(2,'password should have atleast 2 characters').max(12,'password should have atmost 12 characters'),
    firstname:z.string(),
    lastname:z.string().optional(),

})