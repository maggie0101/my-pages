"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { CardContent } from "@mui/material";

import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useChatroom from "@/hooks/useChatroom";
import type { ChatroomData } from "@/lib/types/db";

import NewChatroomDialog from "./NewChatroomDialog";

type ChatListProps = {
  chatrooms: ChatroomData[] | undefined;
  currentUser: string;
};

// ... 其他 import

export default function ChatList({ chatrooms, currentUser }: ChatListProps) {
  const [newChatroomOpen, setNewChatroomOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const { deleteChatroom } = useChatroom();
  const router = useRouter();

  const handleDeleteChatroom = async (chatroomId: string) => {
    try {
      await deleteChatroom({ chatroomId: chatroomId });
      router.push(`/messages`);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  return (
    <div className="flex w-2/5 flex-col gap-4 overflow-y-scroll border-r pb-10">
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-bold">Chat</p>
        </div>
        <IconButton
          className="text-right"
          onClick={() => setNewChatroomOpen(true)}
        >
          <ControlPointIcon />
        </IconButton>
      </div>
      <div>
        <Input
          placeholder="Search user..."
          className="mr-3 rounded border px-4 py-2 focus:outline-none"
          onChange={(e) => {
            setSearchUser(e.target.value);
          }}
        />
      </div>

      <div>
        {searchUser !== "" && chatrooms != undefined
          ? chatrooms
              .filter((chatroom) => chatroom.user.username.includes(searchUser))
              .map((chatroom, i) => (
                <Link key={i} href={`/messages/${chatroom.chatroomId}`}>
                  <Card className="ml-3 mr-3 rounded-md bg-white p-2">
                    <CardTitle className="text-lg font-bold">
                      {chatroom.user.username}
                    </CardTitle>
                    <div className="flex-rows flex ">
                      <CardContent className="text-sm text-gray-700">
                        {chatroom.chatroom.lastSentence}
                        <IconButton
                          onClick={() => {
                            handleDeleteChatroom(chatroom.chatroomId);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))
          : chatrooms !== undefined &&
            chatrooms.map((chatroom, i) => (
              <Link key={i} href={`/messages/${chatroom.chatroomId}`}>
                <Card className="ml-3 mr-3 flex flex-col rounded-md bg-white p-2">
                  <CardTitle className="text-lg font-bold">
                    {chatroom.user.username}
                  </CardTitle>
                  <div className="flex-rows flex ">
                    <CardContent className="text-sm text-gray-700">
                      {chatroom.chatroom.lastSentence}
                      <IconButton
                        onClick={() => {
                          handleDeleteChatroom(chatroom.chatroomId);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
      </div>

      <NewChatroomDialog
        open={newChatroomOpen}
        setNewChatroomOpen={setNewChatroomOpen}
        onClose={() => {
          setNewChatroomOpen(false);
        }}
        currentUser={currentUser}
      />
    </div>
  );
}
