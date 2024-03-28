"use client";

import { useRef } from "react";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";

import { Button } from "@/components/ui/button";
import useChatroom from "@/hooks/useChatroom";

type NewChatroomDialogProps = {
  open: boolean;
  onClose: () => void;
  setNewChatroomOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: string;
};

export default function NewChatroomDialog({
  open,
  onClose,
  setNewChatroomOpen,
  currentUser,
}: NewChatroomDialogProps) {
  const nameRef = useRef<HTMLTextAreaElement>(null);
  // const searchParams = useSearchParams();
  const router = useRouter();
  const { createChatroom } = useChatroom();

  const handleChatroom = async () => {
    if (!nameRef?.current?.value) {
      alert("請輸入名稱");
      return;
    }
    const nameText = nameRef.current?.value;

    try {
      const newChatroomId = await createChatroom({
        toUser: nameText,
        currentUser: currentUser,
      });

      if (nameRef.current) {
        nameRef.current.value = "";
      }

      setNewChatroomOpen(false);

      // const params = new URLSearchParams(searchParams);
      // params.set("title", title!);
      router.push(`/messages/${newChatroomId}`);
    } catch (e) {
      router.push(`/messages`);
      console.log(e);
      alert(e);
      setNewChatroomOpen(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>建立聊天室</DialogTitle>
      <DialogContent>
        <TextField placeholder="請輸入名稱" inputRef={nameRef} />
      </DialogContent>
      <Button variant="outline" onClick={handleChatroom}>
        新增
      </Button>
    </Dialog>
  );
}
