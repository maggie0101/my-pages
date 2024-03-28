import { Stack, TextField } from "@mui/material";
import { useRef } from "react";
import useMessage from "@/hooks/useMessage";
import {type activity } from "@/app/page";


type MessageInputProps = {
  activity:activity;
  username:string;
  joined:boolean;
}
export default function MessageInput({activity,username,joined}:MessageInputProps){
  const messageTextRef = useRef<HTMLTextAreaElement>(null);
  const {postMessage} = useMessage();

  const handleMessage = async(e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key==="Enter"){
      const messageText = messageTextRef.current?.value;
      if(!messageText) return;
      try{
        await postMessage({
          replyName:username,
          activityId:activity.id,
          content:messageText,

        });
        messageTextRef.current.value = "";
      }catch(e){
        console.log(e);
        alert("Error posting message");
      }

        
      }
    
    
  };


  return(
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-end">
        <TextField
          type='text'
          fullWidth
          margin="normal"
          variant="outlined"
          inputRef = {messageTextRef}
          onKeyDown={handleMessage}
          disabled={!joined}
          placeholder={joined ? "留下你的想法" : "參加活動來參與討論吧"}
        />
      </Stack>
    </>
  )
}