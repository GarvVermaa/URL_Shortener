import express from 'express';
import { db } from '../db/index.js'
import { usersTable } from '../models/user.model.js';
import { randomBytes, createHmac } from 'node:crypto';
import { signupPostRequestBodySchema } from '../validation/request.validation.js';
import { eq } from 'drizzle-orm';
import { hashPasswordWithSalt } from '../utils/hash.js';
import { getUserByEmail } from '../services/user.services.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.format() })
  }

  const { firstname, lastname, email, password } = validationResult.data;

  //!Can be used but very manual and basic
  // if (!firstname) {
  //   return res.status(400).json({ error: `Firstname is required` });
  // }  
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: `User with email: ${email} already exists` });
  }

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const [user] = await db.insert(usersTable).values({
    firstname,
    lastname,
    email,
    salt,
    password: hashedPassword
  }).returning({ id: usersTable.id });

  return res.status(201).json({ data: { userId: user.id } })
});

export default router;