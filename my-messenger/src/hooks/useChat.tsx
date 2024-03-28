import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import { pusherClient } from "@/lib/pusher/client";
import { type User, type Chat } from "@/lib/types/db";

type PusherPayload = {
  senderId: User["id"];
  // chat: Chat;
};
export default function useChat() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { messageId } = useParams();
  const chatroomId = Array.isArray(messageId) ? messageId[0] : messageId;

  // useEffect(() => {
  //   // [NOTE] 2023.11.18 - If either of the debounced value is null, then `isSynced` must be true.
  //   //                     Therefore, we don't need to explicitly check for their null values.

  //   const createChat = async () => {

  //     const res = await fetch(`/api/chatrooms/${chatroomId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         authorId,
  //         chatroomId,
  //         content,
  //       }),
  //     });
  //     if (!res.ok) {
  //       return;
  //     }
  //     const data: ChatRoom = await res.json();
  //     // Update the navbar if the title changed
  //     router.refresh();
  //     setChats(data);
  //   };
  //   createChat();
  // }, [router,chatroomId]);

  const createChat = async ({
    authorId,
    chatroomId,
    content,
  }: {
    authorId: string;
    chatroomId: string;
    content: string;
  }) => {
    setLoading(true);
    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        authorId,
        chatroomId,
        content,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  useEffect(() => {
    if (!chatroomId) return;

    const channelName = `private-${chatroomId}`;

    try {
      const channel = pusherClient.subscribe(channelName);

      channel.bind("chat:post", ({ senderId }: PusherPayload) => {
        if (senderId === userId) {
          return;
        }
        router.refresh();
      });
    } catch (error) {
      console.log(error);
      router.push("/messages");
    }

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [chatroomId, router, userId]);
  // console.log(chats);

  // const content = chat?.content || "";
  // const setContent = (newContent: string) => {
  //   if (chat === null) return;
  //   setChat({
  //     ...chat,
  //     content: newContent,
  //   });
  // };
  const deleteChat = async ({ chatId }: { chatId: string }) => {
    setLoading(true);
    const res = await fetch("/api/chats", {
      method: "DELETE",
      body: JSON.stringify({
        chatId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  useEffect(() => {
    if (!chatroomId) return;

    const channelName = `private-${chatroomId}`;

    try {
      const channel = pusherClient.subscribe(channelName);

      channel.bind("chat:delete", ({ senderId }: PusherPayload) => {
        if (senderId === userId) {
          return;
        }
        router.refresh();
      });
    } catch (error) {
      console.log(error);
      router.push("/messages");
    }

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [chatroomId, router, userId]);

  const backChat = async ({
    chatId,
    currentUser,
  }: {
    chatId: string;
    currentUser: string;
  }) => {
    setLoading(true);
    const res = await fetch("/api/chats", {
      method: "PUT",
      body: JSON.stringify({
        chatId,
        currentUser,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  // useEffect(() => {

  //   if(!chatroomId) return;

  //   const channelName = `private-${chatroomId}`;

  //   try {
  //     const channel = pusherClient.subscribe(channelName);

  //     channel.bind("chat:back", ({ senderId, chat: receivedChat }: PusherPayload) => {
  //       if (senderId === userId) {
  //         return;
  //       }
  //       router.refresh();
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     router.push("/messages");
  //   }

  //   return () => {
  //     pusherClient.unsubscribe(channelName);
  //   };
  // }, [chatroomId, router, userId]);

  return {
    createChat,
    loading,
    chats,
    setChats,
    deleteChat,
    backChat,
  };
}
