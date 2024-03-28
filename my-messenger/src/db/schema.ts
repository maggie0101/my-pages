import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
  uuid,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
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

export const usersRelation = relations(usersTable, ({ many }) => ({
  usersToChatrooms: many(usersToChatroomsTable),
}));

export const chatroomsTable = pgTable(
  "chatrooms",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    lastSentence: varchar("last_sentence", { length: 200 }).notNull(),
    announcedSentence: varchar("announced_sentence", { length: 200 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    createdAtIndex: index("created_at_index").on(table.createdAt),
  }),
);

export const chatroomsRelation = relations(chatroomsTable, ({ many }) => ({
  usersToChatrooms: many(usersToChatroomsTable),
}));

export const usersToChatroomsTable = pgTable(
  "users_to_chatrooms",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    chatroomId: uuid("chatroom_id")
      .notNull()
      .references(() => chatroomsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.chatroomId),
    uniqCombination: unique().on(t.userId, t.chatroomId),
  }),
);

export const usersToChatroomsRelation = relations(
  usersToChatroomsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToChatroomsTable.userId],
      references: [usersTable.displayId],
    }),
    chatroom: one(chatroomsTable, {
      fields: [usersToChatroomsTable.chatroomId],
      references: [chatroomsTable.displayId],
    }),
  }),
);

export const chatsTable = pgTable(
  "chats",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    chatroomId: uuid("chatroom_id")
      .notNull()
      .references(() => chatroomsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    content: varchar("content").notNull(),
    notVisible: varchar("not_visible").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    createdAtIndex: index("created_at_index").on(table.createdAt),
  }),
);
