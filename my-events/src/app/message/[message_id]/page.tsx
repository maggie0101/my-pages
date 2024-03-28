import MessagePage from "@/components/MessagePage";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, and, asc } from "drizzle-orm";
import { activitiesTable, messagesTable, joinsTable } from "@/db/schema";


type messagePageProp = {
  params:{
    message_id:string;
  };
  searchParams:{
    username?: string;
  }
}

export default async function messagepage({
  params:{message_id},searchParams:{username}
}:messagePageProp){

  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    redirect(`/?${params.toString()}`);
  };
  const activity_id_num = parseInt(message_id);
  if (isNaN(activity_id_num)) {
    errorRedirect();
  }

  

  //此活動有幾個人參加
  const joins = await db
    .select({
      id: joinsTable.id,
    })
    .from(joinsTable)
    .where(eq(joinsTable.activityId, activity_id_num))
    .execute();

  const numJoins = joins.length;

  

  //用戶是否參加此活動
  const [joined] = await db
    .select({
      id: joinsTable.id,
    })
    .from(joinsTable)
    .where(
      and(
        eq(joinsTable.activityId, activity_id_num),
        eq(joinsTable.userName, username ?? ""),
       
      ),
    )
    .execute();

  

    

    //每則貼文的點讚數量是多少
    // const joinsSubquery = db.$with("joins_count").as(
    //   db
    //     .select({
    //       activityId: joinsTable.activityId,
    //       joins: sql<number | null>`count(*)`.mapWith(Number).as("joins"),
    //     })
    //     .from(joinsTable)
    //     .groupBy(joinsTable.activityId),
    // );

    //用戶是否參加任何貼文
    // const joinedSubquery = db.$with("joined").as(
    //   db
    //     .select({
    //       activityId: joinsTable.activityId,
    //       joined: sql<number>`1`.mapWith(Boolean).as("joined"),
    //     })
    //     .from(joinsTable)
    //     .where(eq(joinsTable.userName, username ?? "")),
    // );

    const [activityData] = await db
      .select({
        id: activitiesTable.id,
        title: activitiesTable.title,
        startAt: activitiesTable.startAt,
        endAt: activitiesTable.endAt,
        

        

       
        createdAt:activitiesTable.createdAt,
      })
      .from(activitiesTable)
      .where(eq(activitiesTable.id,activity_id_num)) 
      .execute()

      if (!activityData) {
        errorRedirect();
      }

    const message = {
      activityId: activityData.id,
      title: activityData.title,
      joins: numJoins,
      createdAt: activityData.createdAt,
      joined: Boolean(joined),
    };



  

    const messages = await db
    .select({
      id: messagesTable.id,
      content: messagesTable.content,
      replyName: messagesTable.replyName,
      activityId: messagesTable.activityId,
      createdAt: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.activityId,activity_id_num))
    .orderBy(asc(messagesTable.createdAt))
    .execute();

    //是否有參加此活動...

  return(
    <>
      <div>
        <MessagePage 
          activity={activityData} 
          messages = {messages}
          initialJoins = {numJoins}
          initialJoined = {message.joined}
          activityId = {message.activityId} />
      </div>
    </>
  )
}