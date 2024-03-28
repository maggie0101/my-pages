
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";






export const activitiesTable = pgTable(
  "activities",
  {
    id:serial("id").primaryKey(),
    title:varchar("title", {length:50}).notNull(),
    startAt:varchar("startAt").notNull(),
    endAt:varchar("endAt").notNull(),
    createdAt:timestamp("created_at").default(sql`now()`),


  }
)





export const messagesTable = pgTable(
  "messages",
  {
    id:serial("id").primaryKey(),
    replyName:varchar("reply_name").notNull(),
    content:varchar("content").notNull(),
    activityId:integer("activity_id")
    .notNull()  
    .references(() => activitiesTable.id, {onDelete:"cascade"}),
    createdAt:timestamp("created_at").default(sql`now()`),

  },
  (table) => ({
    createdAtIndex:index("created_at_index").on(table.createdAt),
  })
);


export const joinsTable = pgTable(
  "joins",
  {
    id: serial("id").primaryKey(),
    userName: varchar("user_name", { length: 50 })
      .notNull(),
      
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    userNameIndex: index("user_name_index").on(table.userName),
    // unique constraints ensure that there are no duplicate combinations of
    // values in the table. In this case, we want to ensure that a user can't
    // like the same tweet twice.
    uniqCombination: unique().on(table.userName, table.activityId),
  }),
);