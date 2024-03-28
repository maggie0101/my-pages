import { NextResponse, type NextRequest } from "next/server";

import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { chatroomsTable, usersTable, usersToChatroomsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

const createChatroomRequestSchema = z.object({
  toUser: z.string().min(1).max(50),
  currentUser: z.string().min(1).max(50),
});

const deleteChatroomRequestSchema = z.object({
  chatroomId: z.string().min(1).max(50),
});

const announcedChatroomRequestSchema = z.object({
  chatroomId: z.string().min(1).max(50),
  content: z.string().min(1).max(200),
});

type createChatroomRequest = z.infer<typeof createChatroomRequestSchema>;
type deleteChatroomRequest = z.infer<typeof deleteChatroomRequestSchema>;
type announcedChatroomRequest = z.infer<typeof announcedChatroomRequestSchema>;

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      chatroomId: string;
    };
  },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get the document
    const dbChatroom = await db.query.usersToChatroomsTable.findFirst({
      where: and(
        eq(usersToChatroomsTable.userId, userId),
        eq(usersToChatroomsTable.chatroomId, params.chatroomId),
      ),
      with: {
        chatroom: {
          columns: {
            displayId: true,
          },
        },
      },
    });
    if (!dbChatroom?.chatroom) {
      return NextResponse.json(
        { error: "Chatroom Not Found" },
        { status: 404 },
      );
    }

    const chatroom = dbChatroom.chatroom;

    return NextResponse.json(
      {
        id: chatroom.displayId,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    createChatroomRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { toUser } = data as createChatroomRequest;
  const { currentUser } = data as createChatroomRequest;
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.username, toUser),
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "User with the provided name does not exist" },
      { status: 404 },
    );
  }

  //修改
  let result = null;

  const chatroomsForUser1 = await db.query.usersToChatroomsTable.findMany({
    where: eq(usersToChatroomsTable.userId, currentUser),
  });

  if (chatroomsForUser1 !== null) {
    for (const room of chatroomsForUser1) {
      const user2InChatroom = await db.query.usersToChatroomsTable.findFirst({
        where: and(
          inArray(usersToChatroomsTable.chatroomId, [room?.chatroomId]),
          eq(usersToChatroomsTable.userId, existingUser.displayId),
        ),
      });

      const user2ChatroomId = user2InChatroom?.chatroomId ?? null;

      if (user2ChatroomId !== null) {
        result = user2ChatroomId;
        break; // 中斷迴圈，因為我們已經找到了一個聊天室
      }
    }
  }
  if (result !== null) {
    // 使用者2在其中一個聊天室中

    return NextResponse.json(
      { error: "Chatroom already exists." },
      { status: 404 },
    );
  }

  // //修

  try {
    const newChatroomId = await db.transaction(async (tx) => {
      const [newChatroom] = await tx
        .insert(chatroomsTable)
        .values({ lastSentence: "Start chatting!", announcedSentence: "" })
        .returning();

      await tx.insert(usersToChatroomsTable).values({
        userId: existingUser.displayId,
        chatroomId: newChatroom.displayId,
      });
      await tx
        .insert(usersToChatroomsTable)
        .values({
          userId: currentUser,
          chatroomId: newChatroom.displayId,
        })
        .execute();

      return newChatroom.displayId;
    });

    return NextResponse.json(newChatroomId, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    deleteChatroomRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { chatroomId } = data as deleteChatroomRequest;

  try {
    await db
      .delete(chatroomsTable)
      .where(eq(chatroomsTable.displayId, chatroomId))
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    announcedChatroomRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { chatroomId, content } = data as announcedChatroomRequest;
  if (!chatroomId || !content) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  try {
    await db
      .update(chatroomsTable)
      .set({ announcedSentence: content })
      .where(eq(chatroomsTable.displayId, chatroomId))
      .returning()
      .execute();
    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
