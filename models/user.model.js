import { timestamp } from 'drizzle-orm/gel-core';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstname: varchar('first_name', { lenght: 25 }).notNull(),
  lastname: varchar('last_name', { lenght: 25 }),
  email: varchar({ lenght: 255 }).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});