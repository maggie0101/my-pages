import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

export default function useUser(){
  const searchParams = useSearchParams();
  const username = useMemo(() => searchParams.get("username") || "DefaultUsername", [searchParams]);


  return{
    username,
  };
}