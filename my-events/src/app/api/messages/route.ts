import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { messagesTable } from "@/db/schema";

const postMessageRequestSchema = z.object({
  replyName:z.string().min(1).max(50),
  content:z.string().min(1).max(200),
  activityId:z.number(),

})

type postMessageRequest = z.infer<typeof postMessageRequestSchema>;

export async function POST(request:NextRequest){

  
  //檢查格式
  const data = await request.json();

  try{ 
    postMessageRequestSchema.parse(data);
    
  }catch(error){

    return NextResponse.json({error:"Invalid request "},{status:400});
  }

  const {replyName, content, activityId} = data as postMessageRequest;


  //寫入DB
  try{
    await db
      .insert(messagesTable)
      .values({
        replyName:replyName,
        content:content,
        activityId:activityId,
      })
      
      .execute();


  }catch(error){
    
    return NextResponse.json(
      {error:"Something went wrong"},
      {status:500},
    );
  }
  return new NextResponse("OK", {status:200})
}
