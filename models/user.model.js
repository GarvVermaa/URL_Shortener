import {pgTable,uuid,varchar } from 'drizzle-orm/pg-core';

export const usersTable= pgTable("users",{
  id: uuid().primaryKey().defaultRandom(),
  firstname: varchar('first_name',{lenght: 25}).notNull(),
  lastname: varchar('last_name',{lenght: 25}),
  email: varchar({lenght:255}).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull

});