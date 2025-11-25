/**
 * 
 * https://app.100xdevs.com/courses/15/749/750
 * on the above video at 1 hour 12 minutes
 */




import express from "express";
import { db, schema, eq } from "db/db";
import { insertWebsite, getWebsite } from "types/types";

const app = express();

app.use(express.json());

app.post("/website", async (req, res) => {
  const { data, success, error } = insertWebsite.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { url } = data;

  const website = await db
    .insert(schema.websites)
    .values({
      url,
    })
    .returning({ id: schema.websites.id });

  return res.status(201).json({ websiteId: website[0]?.id });
});

app.get("/status/:id", async (req, res) => {
  const websiteId = req.params.id;

  if (isNaN(Number(websiteId))) {
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { data, success, error } = getWebsite.safeParse({ id: Number(websiteId) });
  console.log(error);
  if (!success) {
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { id } = data;
  console.log(id);

  const website = await db.query.websites.findFirst({
    where: eq(schema.websites.id, id),
  });

  console.log(website);

  if (!website) {
    return res.status(404).json({ message: "not found" });
  }

  return res.status(200).json({ website });
});

app.listen(3000, () => console.log("code is running on 3000"));

// for testing the db
// (async () => {
//   const website = await db.query.websites.findFirst({
//     where: eq(schema.websites.id, 1),
//   });

//   console.log(website);
// })();
