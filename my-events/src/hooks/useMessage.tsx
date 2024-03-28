import { useState } from "react";

import { useRouter } from "next/navigation";


export default function useMessage(){
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postMessage = async({
    replyName,
    content,
    activityId,
  }:{
    replyName:string;
    content:string;
    activityId:number;
  }) => {
    setLoading(true);

    const res = await fetch("/api/messages" , {
      method:"POST",
      body: JSON.stringify({
        replyName,
        content,
        activityId,
      }),
    });

    if(!res.ok){
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);

  };

  return{
    postMessage,
    loading,

  };

}