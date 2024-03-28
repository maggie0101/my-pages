import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { activitiesTable } from "@/db/schema";



const postActivityRequestSchema = z.object({
  title: z.string().min(1).max(50),
  startAt: z.string().min(1).max(50),
  endAt: z.string().min(1).max(50),

})

type postActivityRequest = z.infer<typeof postActivityRequestSchema>;

export async function POST(request : NextRequest){
  const data = await request.json();
  try{
    postActivityRequestSchema.parse(data);
  } catch(error) {
    return NextResponse.json({error: "Invalid Request"},{status:400});
  }

  const {title, startAt, endAt} = data as postActivityRequest;
  try{
    const newActivity = await db
      .insert(activitiesTable)
      .values({
        title:title,
        startAt:startAt,
        endAt:endAt,
      })
      .returning({id:activitiesTable.id})
      .execute();
    return NextResponse.json({newActivity}, {status:200});
    
  } catch(error) {
    return NextResponse.json(
      {error:"Something went wrong"},
      {status:500},
    );
  }
  return new NextResponse("OK",{status:200});
  

}




