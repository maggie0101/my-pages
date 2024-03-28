import { redirect } from "next/navigation";

import CampaignIcon from "@mui/icons-material/Campaign";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import ChatRoomContent from "./ChatRoomContent";
import ChatRoomInput from "./ChatRoomInput";
import { getOtherUser } from "./action";

type ChatRoomProps = {
  chatroomId: string;
};

export default async function ChatRoom({ chatroomId }: ChatRoomProps) {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  const otherUser = await getOtherUser(userId, chatroomId);

  const chats = await db
    .select({
      id: chatsTable.displayId,
      authorId: chatsTable.authorId,
      chatroomId: chatsTable.chatroomId,
      content: chatsTable.content,
      createdAt: chatsTable.createdAt,
      notVisible: chatsTable.notVisible,
    })
    .from(chatsTable)
    .where(eq(chatsTable.chatroomId, chatroomId))
    .orderBy(asc(chatsTable.createdAt))
    .execute();

  return (
    <div className="flex max-h-screen w-full flex-col  justify-between gap-4 border-r bg-slate-100 p-4">
      <div className="grid grid-cols-2 gap-4">
        <p className="text-xl font-bold">{otherUser?.user.username}</p>
        <div>
          <CampaignIcon /> {otherUser?.chatroom.announcedSentence}
        </div>
      </div>

      <ChatRoomContent
        currentUser={userId}
        chats={chats}
        chatroomId={chatroomId}
      />
      <ChatRoomInput userId={userId} chatroomId={chatroomId} />
    </div>
  );
}
