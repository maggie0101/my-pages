"use client"
import { Box, Typography, Stack, Divider, IconButton } from "@mui/material";
import Button from '@mui/joy/Button';
import Link from "next/link";
import MessageElement from "./MessageElement";
import MessageInput from "./MessageInput";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useState } from "react";
import HeaderBar from "./HeaderBar";
import { type activity, type message } from "@/app/page";

import useUser from "@/hooks/useUser";

import type { EventHandler, MouseEvent } from "react";
import useJoin from "@/hooks/useJoin";

type messagePageProp = {
  activity:activity;
  messages:message[];
  initialJoins:number;
  initialJoined:boolean;
  activityId:number;
}


export default function MessagePage({
  activity,
  messages,
  initialJoins,
  initialJoined,
  activityId,}:messagePageProp){

  const [joined, setJoined] = useState(initialJoined);
  const [joinsCount, setJoinsCount] = useState(initialJoins);
  const { joinActivity, unJoinActivity } = useJoin();
  const[joinButton, setJoinButton] = useState(false);
  const {username} = useUser();




  const handleJoinButton:EventHandler<MouseEvent> = async(e) => {
    
    e.stopPropagation();
    e.preventDefault();

    if (!username) return;
    if (joined) {
      await unJoinActivity({
        activityId,
        userName: username,
      });
      setJoinsCount((prev) => prev - 1);
      setJoined(false);
      setJoinButton(!joinButton);
    } else {
      await joinActivity({
        activityId,
        userName: username,
      });
      setJoinsCount((prev) => prev + 1);
      setJoined(true);
      setJoinButton(!joinButton);
    }




    

  }

  return(
    <main>
      <HeaderBar/>
      <div >
        
        <div>
          <Stack 
            direction="row"
            sx={{
            bgcolor: 'background.paper',
            p: 2,
            minWidth: 300,
            
          }}>
            <Link
              href={`/?username=${username}`}>
              <IconButton>
                <ArrowBackIosIcon/>
              </IconButton>
            </Link>
            
            <Stack direction="column">
              <Typography variant="h4">{activity.title}</Typography>
              <Typography variant="h6">參加人數:{joinsCount}</Typography>
            </Stack>
            
          </Stack>
        </div>
        <Divider/>
        <Stack direction="row">
          <Box sx={{
            bgcolor: 'background.paper',
            p: 2,
            minWidth: 300,
          }}>

            <Typography>開始日期:{activity.startAt}</Typography>
          </Box>
          <Box sx={{
            bgcolor: 'background.paper',
            p: 2,
            minWidth: 300,
          }}>
            <Typography>結束日期:{activity.endAt}</Typography>
          </Box>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={0.5}
          >
            <Button
              variant={joined ? "soft" : "outlined"}
              color="success"
              sx={{ 
                ml: 1,
                backgroundColor: 'success.main', // 设置按钮的背景颜色
                color: 'success.contrastText', // 设置按钮的文本颜色
              }}
              onClick={handleJoinButton}
            >
              {joined ? "我已參加" : "我想參加"}
            </Button>
          </Stack>
        </Stack>
        <Divider/>
      </div>
      <Stack>
        
        {messages.map((message)=>(
          
            <MessageElement 
              key = {message.id} 
              message={message}
            />
      
        ))}
        

      

        <MessageInput activity = {activity} username = {username!} joined = {joined}/>
      </Stack>


    </main>


  );
}