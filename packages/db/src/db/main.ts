import { integer, pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const websiteStatus = pgEnum("websiteStatus", ["Up", "Down", "Unkown"]);

export const websites = pgTable("websites", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: text("url").notNull(),
  timeAdded: timestamp("timeAdded", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const region = pgTable("region", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export const ticks = pgTable("ticks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  response_time: integer("response_time").notNull(),
  status: websiteStatus(),
  regionId: integer().primaryKey().generatedAlwaysAsIdentity(),
  websiteId: integer().primaryKey().generatedAlwaysAsIdentity(),
});

export const websitesRealtion = relations(websites, ({ many }) => ({
  ticks: many(ticks),
}));

export const regionRealtion = relations(region, ({ many }) => ({
  ticks: many(ticks),
}));

export const ticksRelation = relations(ticks, ({ one }) => ({
  websites: one(websites, {
    fields: [ticks.websiteId],
    references: [websites.id],
  }),
  regions: one(websites, {
    fields: [ticks.websiteId],
    references: [websites.id],
  }),
}));
