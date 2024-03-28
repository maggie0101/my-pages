import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { usersToChatroomsTable } from "@/db/schema";

// export async function getOtherUser(currentUser:string, currentChatroom:string){

//   const dbOtherUser = await db.query.usersToChatroomsTable.findFirst({
//     where: and(eq(usersToChatroomsTable.chatroomId, currentChatroom), ne(usersToChatroomsTable.userId, currentUser)),
//     with:{
//       user:{
//         columns:{
//           username:true,
//         }
//       }
//     }
//   })
//   return dbOtherUser;
// }
export async function getOtherUser(
  currentUser: string,
  currentChatroom: string,
) {
  // console.log("a",currentUser);
  // console.log("b",currentChatroom);
  try {
    const dbOtherUser = await db.query.usersToChatroomsTable.findFirst({
      where: and(
        eq(usersToChatroomsTable.chatroomId, currentChatroom),
        ne(usersToChatroomsTable.userId, currentUser),
      ),
      with: {
        user: {
          columns: {
            username: true,
          },
        },
        chatroom: {
          columns: {
            announcedSentence: true,
          },
        },
      },
    });
    // console.error("a");

    if (!dbOtherUser) {
      console.error("No user found for the given criteria.");
      return null; // or handle the absence of user data appropriately
    }

    return dbOtherUser;
  } catch (error) {
    console.error("Error while fetching other user:", error);
    throw error; // or handle the error appropriately
  }
}
