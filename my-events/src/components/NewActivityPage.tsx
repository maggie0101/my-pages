'use client';
import * as React from 'react';

import {  useSearchParams, useRouter } from "next/navigation";
import Button from '@mui/material/Button';

import { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import useActivity from '@/hooks/useActivity';
import useUser from '@/hooks/useUser';
import useJoin from '@/hooks/useJoin';


type NewActivityProps = {
  open:boolean
  onClose: () => void;
  setNewActivityOpen:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function NewActivityPage({open, onClose, setNewActivityOpen}:NewActivityProps){
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const startAtRef = useRef<HTMLTextAreaElement>(null);
  const endAtRef = useRef<HTMLTextAreaElement>(null);
  const startAtTimeRef = useRef<HTMLTextAreaElement>(null);
  const endAtTimeRef = useRef<HTMLTextAreaElement>(null);

  const { postActivity, loading } = useActivity();
  const {joinActivity} = useJoin();
  const {username} = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  
  const handleActivity = async() => {
    if(!titleRef.current?.value){
      alert("請輸入活動名稱")
      return;
    }

    if (!startAtRef.current?.value || !endAtRef.current?.value || !startAtTimeRef.current?.value || !endAtTimeRef.current?.value) {
      alert("請選擇開始和結束的日期與時間");
      return;
    }

    const titleText = titleRef.current?.value;
    

    const startAtValue = startAtRef.current?.value;
    const startAtTimeValue = startAtTimeRef.current?.value;
    const startAtText = `${startAtValue} ${startAtTimeValue}`;
    
    const endAtValue = endAtRef.current?.value;
    const endAtTimeValue = endAtTimeRef.current?.value;
    const endAtText = `${endAtValue} ${endAtTimeValue}`;

    const startDate = new Date(startAtText);
    const endDate = new Date(endAtText);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (dayDiff > 7) {
      alert("日期間隔必須小於等於7天");
      return;
    }
    if (timeDiff < 0 ) {
      alert("結束時間需晚於開始時間");
      return;
    }


    try{
      
      const newActivityId = await postActivity({
        
        title:titleText,
        startAt:startAtText,
        endAt:endAtText,
      });

      await joinActivity({
        activityId:newActivityId,
        userName:username,
      })
      
      if (titleRef.current && startAtRef.current && endAtRef.current) {
        titleRef.current.value = "";
        startAtRef.current.value = "";
        endAtRef.current.value = "";
      }





      const params = new URLSearchParams(searchParams);
      params.set("username", username!);
      router.push(`/message/${newActivityId}?${params.toString()}`);
      setNewActivityOpen(false);

      



    }catch(e){
      
      console.log(e);
      alert("Error posting activity");
    }

  };


  return(
    <Dialog 
      open={open} 
      onClose={onClose}
    >
      <DialogTitle>新增活動</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="請輸入活動名稱"
          inputRef={titleRef}
        />
        <TextField
          helperText="請輸入開始日期"
          type='date'
          fullWidth
          margin="normal"
          variant="outlined"
          inputRef={(startAtRef)}

          
        />
        <TextField
          helperText="請輸入開始時間"
          type='time'
          fullWidth
          margin="normal"
          variant="outlined"
          inputRef={(startAtTimeRef)}
        />
        <TextField
          helperText="請輸入結束日期"
          type='date'
          fullWidth
          margin="normal"
          variant="outlined"
          inputRef={endAtRef}
        />
        <TextField
          helperText="請輸入結束時間"
          type='time'
          fullWidth
          margin="normal"
          variant="outlined"
          inputRef={endAtTimeRef}
        />
        <Button
          variant="outlined"
          sx={{ ml: 1 }}
          onClick={handleActivity}
          disabled={loading}
        >
          新增
        </Button>

      </DialogContent>

    </Dialog>

  );
}