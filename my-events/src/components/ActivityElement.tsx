'use client';
import * as React from 'react';
import Link from "next/link";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckIcon from '@mui/icons-material/Check';

import Typography from '@mui/material/Typography';
import {Box} from '@mui/material';
import { type activitydata } from '@/app/page';

type ActivityElementProps = {
  
  activity:activitydata;
  id:number;
  username:string;
  

}


export default function ActivityElement({
  activity,
  id,
  username,
  
}:ActivityElementProps){

  return(
    <Link
      href={{
        pathname:`/message/${id}`,
        query:{
          username,
        },
      }}
    >
      <Box sx={{
        bgcolor: 'background.paper',
        p: 2,
        minWidth: 300}}
      >
        <Card sx={{ width: '90%', backgroundColor: '#f5f5f5' }}>
          
          
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {activity.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              參加人數:{activity.joins ?? "0"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {activity.startAt} ~ {activity.endAt}
            </Typography>
            {activity.joined?<CheckIcon  color="success"/>:""}
            
            
          </CardContent >
          
          
        </Card>
      </Box>
    </Link>
  );
}