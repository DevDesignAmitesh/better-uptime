import express from "express";
import { db, schema, asc, eq, and } from "db/db";
import { insertWebsite, getWebsite } from "types/types";
import { generateToken } from "./utils";
import { AuthSchema } from "./types";
import { middleware } from "./middleware";

const app = express();

app.use(express.json());

app.post("/website", middleware, async (req, res) => {
  const userId = req.user?.userId!
  const { data, success, error } = insertWebsite.safeParse(req.body);

  if (!success) {
    console.log(error);
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { url } = data;

  const website = await db
    .insert(schema.websites)
    .values({
      url,
      userId
    })
    .returning({ id: schema.websites.id });

  return res.status(201).json({ websiteId: website[0]?.id });
});

app.get("/status/:id", middleware, async (req, res) => {
  const userId = req.user?.userId!
  const websiteId = req.params.id;

  if (isNaN(Number(websiteId))) {
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { data, success, error } = getWebsite.safeParse({
    id: Number(websiteId),
  });

  if (!success) {
    console.log(error);
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { id } = data;

  const website = await db
    .select()
    .from(schema.websites)
    .where(and(eq(schema.websites.id, id), eq(schema.websites.userId, userId)))
    .orderBy(asc(schema.websites.createdAt))
    .limit(1);

  console.log("this is the website", website)

  if (website.length === 0) {
    return res.status(404).json({ message: "not found" });
  }

  return res.status(200).json({ website });
});

app.post("/signup", async (req, res) => {
  const { data, success, error } = AuthSchema.safeParse(req.body);

  if (!success) {
    console.log(error);
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { email, password } = data;

  try {
    await db.insert(schema.users).values({
      email,
      password,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(409)
      .json({ message: "user already exists with the given email" });
  }

  return res.status(201).json({ message: "user created" });
});

app.post("/signin", async (req, res) => {
  const { data, success, error } = AuthSchema.safeParse(req.body);

  if (!success) {
    console.log(error);
    return res.status(411).json({ message: "invalid inputs" });
  }

  const { email, password } = data;

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "user not found with the given email" });
  }

  if (existingUser.password.trim() !== password.trim()) {
    return res.status(400).json({ message: "invalid password" });
  }

  const token = generateToken({ userId: existingUser.id });

  console.log("generated token", token);

  return res.status(200).json({ token });
});

app.listen(3000, () => console.log("code is running on 3000"));

// for testing the db
// (async () => {
//   const website = await db.query.websites.findFirst({
//     where: eq(schema.websites.id, 1),
//   });

//   console.log(website);
// })();
