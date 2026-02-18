import z, { email } from 'zod';

import { usernameSchema } from './signupSchema';
import { Types } from 'mongoose';
export const transferAmountSchema = z.object({
    recipientID:z.string().regex(/^[0-9a-fA-F]{24}$/,'kindly enter the recipientID'),
    amount:z.number()

})