import { integer, pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const websiteStatus = pgEnum("websiteStatus", ["Up", "Down", "Unkown"]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull(),
  password: text("password").notNull(),

  createdAt: timestamp("timeAdded", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  websites: many(websites),
}));

export const websites = pgTable("websites", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: text("url").notNull(),

  createdAt: timestamp("timeAdded", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const websitesRealtion = relations(websites, ({ many }) => ({
  ticks: many(ticks),
}));

export const region = pgTable("region", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export const regionRealtion = relations(region, ({ many }) => ({
  ticks: many(ticks),
}));

export const ticks = pgTable("ticks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  response_time: integer("response_time").notNull(),
  status: websiteStatus(),
  regionId: integer(),
  websiteId: integer(),

  createdAt: timestamp("timeAdded", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const ticksRelation = relations(ticks, ({ one }) => ({
  websites: one(websites, {
    fields: [ticks.websiteId],
    references: [websites.id],
  }),
  regions: one(websites, {
    fields: [ticks.regionId],
    references: [websites.id],
  }),
}));
