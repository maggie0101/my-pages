'use client';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { validateUsername } from "@/lib/utils";


type UserChagePageProps={
  userChange:boolean;
  setUserChange:React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export default function UserChagePage({userChange, setUserChange, onClose}:UserChagePageProps){
  const userNameInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();



  useEffect(() => {
    const username = searchParams.get("username");
    setUserChange(!validateUsername(username));
  },[searchParams,setUserChange]);

  const nameSave = () => {
    const username = userNameInputRef.current?.value;

    const params = new URLSearchParams(searchParams);

    params.set("username",username!);
    router.push(`${pathname}?${params.toString()}`);
    setUserChange(false);
    return true;

  }
  return(
    <Dialog open={userChange} onClose={onClose} >
      <DialogTitle>切換使用者</DialogTitle>
      <DialogContent>
        <TextField
          label="請輸入使用者名稱"
          inputRef={userNameInputRef}
        />
      </DialogContent>
      <Button
        onClick={nameSave}
      >確定</Button>
    </Dialog>
  )
}