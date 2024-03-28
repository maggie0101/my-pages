import { and, eq, inArray, ne } from "drizzle-orm";

import { db } from "@/db";
import { usersToChatroomsTable } from "@/db/schema";

export const getChatrooms = async (userId: string) => {
  "use server";
  const chatroomsForCurrentUser = await db.query.usersToChatroomsTable.findMany(
    {
      where: eq(usersToChatroomsTable.userId, userId),
      with: {
        chatroom: {
          columns: {
            displayId: true,
            lastSentence: true,
          },
        },
      },
    },
  );
  const chatroomIdsForCurrentUser = chatroomsForCurrentUser.map(
    (usersToChatrooms) => usersToChatrooms.chatroom.displayId,
  );

  if (chatroomIdsForCurrentUser && chatroomIdsForCurrentUser.length > 0) {
    const otherUsersInRooms = await db.query.usersToChatroomsTable.findMany({
      where: and(
        inArray(usersToChatroomsTable.chatroomId, chatroomIdsForCurrentUser),
        ne(usersToChatroomsTable.userId, userId),
      ),
      with: {
        user: {
          columns: {
            username: true,
          },
        },
        chatroom: {
          columns: {
            lastSentence: true,
          },
        },
      },
    });

    return otherUsersInRooms;
  }
};
