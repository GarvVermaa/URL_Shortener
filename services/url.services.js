import { urlsTable } from "../models/index.js";
import { db } from '../db/index.js'

export async function createShortUrl(originalUrl, shortCode, userId) {
  const [result] = await db.insert(urlsTable).values({
    shortCode,
    targetURL: originalUrl,
    userId: userId,
  }).returning({
    id: urlsTable.id,
    shortCode: urlsTable.shortCode,
    targetUrl: urlsTable.targetURL
  });
  return result
}