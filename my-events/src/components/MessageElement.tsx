'use client'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {type message } from '@/app/page';

type MessageElementProps = {
  message:message;
}

export default function MessageElement({message}:MessageElementProps){
  return(
    <Card
      sx={{
        minWidth: 200,
        height: "auto",
        borderRadius: "12px",
      
      }}>
      <CardContent >
        
          <Typography gutterBottom variant="h6" component="div"  sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', }}>
            {message.replyName} : {message.content}
          </Typography>    
      </CardContent>
    </Card>
  ); 
}