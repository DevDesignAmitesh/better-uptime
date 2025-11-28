import {
  integer,
  pgTable,
  text,
  timestamp,
  pgEnum,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const websiteStatus = pgEnum("websiteStatus", ["Up", "Down", "Unkown"]);

export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),

    createdAt: timestamp("timeAdded", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => [uniqueIndex("emailUnique").on(table.email)]
);

export const usersRelations = relations(users, ({ many }) => ({
  websites: many(websites),
}));

export const websites = pgTable("websites", {
  id: uuid().defaultRandom().primaryKey(),
  url: text("url").notNull(),

  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const websitesRealtion = relations(websites, ({ many, one }) => ({
  ticks: many(ticks),
  user: one(users, {
    references: [users.id],
    fields: [websites.userId]
  })
}));

export const region = pgTable("region", {
  id: uuid().defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

export const regionRealtion = relations(region, ({ many }) => ({
  ticks: many(ticks),
}));

export const ticks = pgTable("ticks", {
  id: uuid().defaultRandom().primaryKey(),
  response_time: integer("response_time").notNull(),
  status: websiteStatus(),
  regionId: uuid()
    .notNull()
    .references(() => region.id, { onDelete: "cascade" }),
  websiteId: uuid()
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),

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
  regions: one(region, {
    fields: [ticks.regionId],
    references: [region.id],
  }),
}));
