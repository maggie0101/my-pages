import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db";

import HeaderBar from '@/components/HeaderBar'
import HomePage from '@/components/HomePage';

import { activitiesTable, joinsTable } from "@/db/schema";

export type activity = {
  id:number;
  title:string;
  startAt:string;
  endAt:string;  



}

export type activitydata = {
  id:number;
  title:string;
  startAt:string;
  endAt:string;  
  joins:number;
  joined:boolean;


}

export type message = {
  id:number;
  content:string;
  replyName:string;
  activityId:number;    
}

type HomeProps = {
  searchParams: {
    username?: string;
  };
}
export default async function Home({searchParams:{username}}:HomeProps) {

  



    //每則貼文的點讚數量是多少
    const joinsSubquery = db.$with("joins_count").as(
      db
        .select({
          activityId: joinsTable.activityId,
          joins: sql<number | null>`count(*)`.mapWith(Number).as("joins"),
        })
        .from(joinsTable)
        .groupBy(joinsTable.activityId),
    );

    //用戶是否參加任何貼文
    const joinedSubquery = db.$with("joined").as(
      db
        .select({
          activityId: joinsTable.activityId,
          joined: sql<number>`1`.mapWith(Boolean).as("joined"),
        })
        .from(joinsTable)
        .where(eq(joinsTable.userName, username ?? "")),
    );


    const activities = await db
      .with(joinsSubquery, joinedSubquery)
      .select({
        id: activitiesTable.id,
        title: activitiesTable.title,
        startAt: activitiesTable.startAt,
        endAt: activitiesTable.endAt,
        joins:joinsSubquery.joins,
        joined:joinedSubquery.joined,
        createdAt: activitiesTable.createdAt,
      })
      .from(activitiesTable)
      .orderBy(desc(activitiesTable.createdAt))
      .leftJoin(joinsSubquery, eq(activitiesTable.id, joinsSubquery.activityId))
      .leftJoin(joinedSubquery, eq(activitiesTable.id, joinedSubquery.activityId))
      .execute();



  return (
    <main>
      <HeaderBar/>
      <HomePage 
        activities={activities}
      />
      
   
      
    
    </main>
  );
}
