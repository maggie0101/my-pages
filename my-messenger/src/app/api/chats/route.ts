import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import Pusher from "pusher";
import { z } from "zod";

import { db } from "@/db";
import { chatroomsTable, chatsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";

const createChatRequestSchema = z.object({
  authorId: z.string().min(1).max(50),
  chatroomId: z.string().min(1).max(50),
  content: z.string().min(1).max(200),
});

const deleteChatRequestSchema = z.object({
  chatId: z.string().min(1).max(200),
});

const backChatRequestSchema = z.object({
  chatId: z.string().min(1).max(200),
  currentUser: z.string().min(1).max(200),
});
type createChatRequest = z.infer<typeof createChatRequestSchema>;
type deleteChatRequest = z.infer<typeof deleteChatRequestSchema>;
type backChatRequest = z.infer<typeof backChatRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    createChatRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
  const { authorId, chatroomId, content } = data as createChatRequest;

  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const [postedChat] = await db
      .insert(chatsTable)
      .values({
        authorId: authorId,
        chatroomId: chatroomId,
        content: content,
        notVisible: "none",
      })
      .returning();

    await db
      .update(chatroomsTable)
      .set({ lastSentence: content })
      .where(eq(chatroomsTable.displayId, chatroomId))
      .execute();

    const pusher = new Pusher({
      appId: privateEnv.PUSHER_ID,
      key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
      secret: privateEnv.PUSHER_SECRET,
      cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    await pusher.trigger(`private-${postedChat.chatroomId}`, "chat:post", {
      senderId: userId,
      chat: {
        authorId: postedChat.authorId,
        chatroomId: postedChat.chatroomId,
        content: postedChat.content,
        notVisible: postedChat.notVisible,
      },
    });

    // await pusher.trigger(`${postedChat.displayId}`, "chat:post", {
    //   senderId: userId,
    //   document: {
    //     id: postedChat.displayId,
    //     authorId:postedChat.authorId,
    //     chatroomId: postedChat.chatroomId,
    //     notVisible:postedChat.notVisible,
    //     content: postedChat.content,
    //     createdAt:postedChat.createdAt,

    //   },
    // });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return NextResponse.json("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    deleteChatRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { chatId } = data as deleteChatRequest;
  if (!chatId) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const [deletedChat] = await db
      .delete(chatsTable)
      .where(eq(chatsTable.displayId, chatId))
      .returning()
      .execute();

    await db
      .update(chatroomsTable)
      .set({ lastSentence: "" })
      .where(eq(chatroomsTable.displayId, deletedChat.chatroomId))
      .execute();

    const pusher = new Pusher({
      appId: privateEnv.PUSHER_ID,
      key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
      secret: privateEnv.PUSHER_SECRET,
      cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    await pusher.trigger(`private-${deletedChat.chatroomId}`, "chat:delete", {
      senderId: userId,
      chat: {
        authorId: deletedChat.authorId,
        chatroomId: deletedChat.chatroomId,
        content: deletedChat.content,
        notVisible: deletedChat.notVisible,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    backChatRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
  const { chatId } = data as backChatRequest;
  const { currentUser } = data as backChatRequest;

  if (!chatId || !currentUser) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  try {
    const [backChat] = await db
      .update(chatsTable)
      .set({ notVisible: currentUser })
      .where(eq(chatsTable.displayId, chatId))
      .returning()
      .execute();

    await db
      .update(chatroomsTable)
      .set({ lastSentence: "" })
      .where(eq(chatroomsTable.displayId, backChat.chatroomId))
      .execute();

    // const pusher = new Pusher({
    //   appId: privateEnv.PUSHER_ID,
    //   key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
    //   secret: privateEnv.PUSHER_SECRET,
    //   cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
    //   useTLS: true,

    // await pusher.trigger(`private-${postedChat.chatroomId}`, "chat:back", {
    //   senderId: userId,
    //   chat: {
    //     authorId: postedChat.authorId,
    //     chatroomId: postedChat.chatroomId,
    //     content: postedChat.content,
    //     notVisible:postedChat.notVisible,
    //   },

    // });

    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
