import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { db } from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { nanoid } from 'nanoid';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';
import { createShortUrl } from '../services/url.services.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/shorten', ensureAuthenticated, async (req, res) => {

  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  try {
    const result = await createShortUrl(url, shortCode, req.user.id);
    return res.status(201).json({
      id: result.id,
      shortCode: result.shortCode,
      targetURL: result.targetUrl
    });
  } catch (error) {
    console.error("Error creating URL:", error);
    return res.status(500).json({ error: `Failed to create URL` })
  }




});

router.get('/:shortCode', async function (req, res) {
  const code = req.params.shortCode;
  const [result] = await db
    .select({
      targetURL: urlsTable.targetURL
    })
    .from(urlsTable)
    .where(eq(code, urlsTable.shortCode));
  if (!result) {
    return res.status(404).json({ error: `Invalid URL` });
  }

  return res.redirect(result.targetURL);

});




export default router;