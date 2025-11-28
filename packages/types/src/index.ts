import z from "zod";

export const insertWebsite = z.object({
  url: z.url(),
});

export const getWebsite = z.object({
  id: z.string(),
});
