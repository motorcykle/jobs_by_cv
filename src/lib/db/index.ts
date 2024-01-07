import { pgTable, text } from 'drizzle-orm/pg-core';
import { drizzle } from '@xata.io/drizzle';
import { eq } from 'drizzle-orm';
import { getXataClient } from './xata'; // Generated client
 
const xata = getXataClient();

export const db = drizzle(xata);