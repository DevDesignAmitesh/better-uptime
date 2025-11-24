import express from "express";
import { db, schema, eq } from "db/db";

const app = express();

app.post("/website", async (req, res) => {
  const website = await db
    .insert(schema.websites)
    .values({
      url: req.body.url,
      timeAdded: new Date(),
    })
    .returning({ id: schema.websites.id });

  return res.status(200).json({ websiteId: website[0]?.id });
});

app.get("/status/:websiteId", async (req, res) => {
  const { websiteId } = req.params;
  const website = await db.query.websites.findFirst({
    where: eq(schema.websites.id, Number(websiteId)),
  });

  return res.status(200).json({ website });
});

app.listen(3000, () => console.log("code is running on 3000"));
