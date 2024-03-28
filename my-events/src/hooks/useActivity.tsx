import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useActivity(){
  const[loading, setLoading] = useState(false);
  const router = useRouter();

  const postActivity = async ({
    title,
    startAt,
    endAt,
  }:{
    title:string;
    startAt:string;
    endAt:string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/activities",{
      method:"POST",
      body:JSON.stringify({
        title,
        startAt,
        endAt,
      }),
    });

    if(!res.ok){
      const body = await res.json();
      throw new Error(body.error);
    }

    const response = await res.json();
    const newActivityId = response.newActivity[0].id;

    router.refresh();
    setLoading(false);
    return newActivityId;
  };
  return{
    postActivity,
    loading,
  };
}