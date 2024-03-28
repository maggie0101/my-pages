"use client";

import { useRef } from "react";

import { TextField } from "@mui/material";

import useChat from "@/hooks/useChat";

type ChatRoomInputProps = {
  userId: string;
  chatroomId: string;
};

export default function ChatRoomInput({
  userId,
  chatroomId,
}: ChatRoomInputProps) {
  const { createChat } = useChat();
  const chatTextRef = useRef<HTMLTextAreaElement>(null);

  const handleChat = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      const chatText = chatTextRef.current?.value;
      if (!chatText) return;
      try {
        chatTextRef.current.value = "";
        await createChat({
          authorId: userId,
          chatroomId: chatroomId,
          content: chatText,
        });
      } catch (error) {
        console.log(error);
        alert("Error posting chat");
      }
    }
  };

  return (
    <div className="mr-2">
      <TextField
        sx={{ width: "100%" }} // 使用 sx 設定樣式
        placeholder="Send messages..."
        inputRef={chatTextRef}
        onKeyDown={handleChat}
      />
    </div>
  );
}
