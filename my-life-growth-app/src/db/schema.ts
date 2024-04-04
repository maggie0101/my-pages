import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToPets: many(usersToPetsTable),
  usersToPlants: many(usersToPetsTable),
  usersToItems: many(usersToItemsTable),
}));

export type characterEnumType = "study" | "health" | "work" | "hobby";
export const characterEnum = pgEnum("character_type", [
  "study",
  "health",
  "work",
  "hobby",
]);

export const gameUsersTable = pgTable("game_users", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  character: characterEnum("character").notNull(),
  experience: integer("experience").default(0),
  healthPoint: integer("health_point").notNull(),
  attackPoint: integer("attack_point").notNull(),
  money: integer("money").default(0),
});

export type questTypeEnumType = "daily" | "weekly";
export const questTypeEnum = pgEnum("quest_type", ["daily", "weekly"]);

export const questTemplatesTable = pgTable("quest_templates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  level: integer("level").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.displayId, { onDelete: "cascade" }),
  enable: boolean("enable").default(true),
  type: questTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const questTemplatesTableRelations = relations(
  questTemplatesTable,
  ({ many }) => ({
    quests: many(questsTable),
  }),
);

export const questsTable = pgTable("quests", {
  id: serial("id").primaryKey(),
  quest_template_id: integer("quest_template_id")
    .notNull()
    .references(() => questTemplatesTable.id, { onDelete: "no action" }),
  game_user_id: uuid("game_user_id")
    .notNull()
    .references(() => usersTable.displayId, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  level: integer("level").notNull(),
  type: questTypeEnum("type").notNull(),
  done: boolean("done").default(false),
  doneAt: timestamp("done_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const questsTableRelations = relations(questsTable, ({ one }) => ({
  template: one(questTemplatesTable, {
    fields: [questsTable.quest_template_id],
    references: [questTemplatesTable.id],
  }),
}));

export const petsTable = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  price: integer("price").notNull(),
});

export const petsRelations = relations(petsTable, ({ many }) => ({
  usersToPets: many(usersToPetsTable),
}));

export const plantsTable = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  price: integer("price").notNull(),
});

export const plantsRelations = relations(plantsTable, ({ many }) => ({
  usersToPlants: many(usersToPlantsTable),
}));

export const itemsTable = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  attackBuff: integer("attack_buff").notNull(),
  healthBuff: integer("health_buff").notNull(),
  moneyBuff: integer("money_buff").notNull(),
  price: integer("price").notNull(),
});

export const itemsRelations = relations(itemsTable, ({ many }) => ({
  usersToItems: many(usersToItemsTable),
}));

export const cardsTable = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  attack: integer("attack").notNull(),
  shield: integer("shield").notNull(),
  cost: integer("cost").notNull(),
});

export const cardsRelations = relations(cardsTable, ({ many }) => ({
  usersToCards: many(usersToCardsTable),
}));

export const usersToPetsTable = pgTable("users_to_pets", {
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId),
  petId: integer("pet_id")
    .notNull()
    .references(() => petsTable.id),
});

export const usersToPlantsTable = pgTable("users_to_plants", {
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId),
  plantId: integer("plant_id")
    .notNull()
    .references(() => plantsTable.id),
});

export const usersToItemsTable = pgTable("users_to_items", {
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId),
  itemId: integer("item_id")
    .notNull()
    .references(() => itemsTable.id),
});

export const usersToItemsRelations = relations(
  usersToItemsTable,
  ({ one }) => ({
    item: one(itemsTable, {
      fields: [usersToItemsTable.itemId],
      references: [itemsTable.id],
    }),
    user: one(gameUsersTable, {
      fields: [usersToItemsTable.userId],
      references: [gameUsersTable.userId],
    }),
  }),
);

export const usersToCardsTable = pgTable("users_to_cards", {
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId),
  cardId: integer("card_id")
    .notNull()
    .references(() => cardsTable.id),
});

export const usersToCardsRelations = relations(
  usersToCardsTable,
  ({ one }) => ({
    card: one(cardsTable, {
      fields: [usersToCardsTable.cardId],
      references: [cardsTable.id],
    }),
    user: one(gameUsersTable, {
      fields: [usersToCardsTable.userId],
      references: [gameUsersTable.userId],
    }),
  }),
);
