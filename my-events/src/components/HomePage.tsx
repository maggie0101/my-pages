'use client';
import React from "react";
import ActivityElement from '@/components/ActivityElement';
import { Typography, TextField, Button } from "@mui/material";
import { Box, Stack } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

import InputAdornment from '@mui/material/InputAdornment';

import NewActivityPage from "./NewActivityPage";
import { useState } from "react";

import UserChangePage from "./UserChangePage";
import { type activitydata } from "@/app/page";
import useUser from "@/hooks/useUser";

type HomePageProps = {
  activities:activitydata[];

  
  
}

export default function HomePage({
  activities,

  
  
}:HomePageProps) {
  const [newActivityOpen, setNewActivityOpen] = useState(false);
  const [userChange, setUserChange] = useState(false);
  const {username} = useUser();
  const [search, setSearch] = useState("");


  
  return (
    <main>
      <div >
        <Box sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          p: 5,
          minWidth: 300,
        }}>
          <Typography variant="h4">{username ?? "..."}</Typography>
        </Box>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="搜尋想參加的活動"
            value = {search}
            onChange={(e) => {setSearch(e.target.value)}}
            sx={{ ml: 2, width: '85%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
      
          <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={()=>{setUserChange(true)}}
          >
            切換使用者
          </Button>
          <Button 
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={() => setNewActivityOpen(true)}
          >
            新增
          </Button>

        </Box> 
      </div>
      <Box>
        <Stack spacing={2} justifyContent="center" sx={{ml:"5%", mt:"5%"}}>
          {search != ""
            ? activities
              .filter((activity) => activity.title.includes(search))
              .map((activity)=>(
                <ActivityElement 
                  key = {activity.id} 
                  activity={activity}
                  id = {activity.id}
                  username = {username}
                />
          
              ))
            : activities.map((activity)=>(
                <ActivityElement 
                  key = {activity.id} 
                  activity={activity}
                  id = {activity.id}
                  username = {username}
                />
            ))}
        </Stack>
      
        
      </Box>
      <NewActivityPage
        open={newActivityOpen}
        setNewActivityOpen = {setNewActivityOpen}
        onClose={() => setNewActivityOpen(false)}
      />
      <UserChangePage
        userChange={userChange}
        setUserChange = {setUserChange}
        onClose = {() => {setUserChange(false)}}
        
        
      />

     
    </main>
  );
}
