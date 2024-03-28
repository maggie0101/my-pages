import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useChatroom() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createChatroom = async ({
    toUser,
    currentUser,
  }: {
    toUser: string;
    currentUser: string;
  }) => {
    setLoading(true);

    // console.log("a", toUser);
    // console.log("b", currentUser);

    try {
      const res = await fetch("/api/chatrooms", {
        method: "POST",
        body: JSON.stringify({
          toUser,
          currentUser,
        }),
      });

      console.log(res);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }

      const response = await res.json();
      const newChatroomId = response;
      router.refresh();
      // console.log("new",newChatroomId);

      return newChatroomId;
    } catch (error) {
      console.error("Error creating chatroom:", error);
      throw error;
      // router.push("/messages");
      // router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const deleteChatroom = async ({ chatroomId }: { chatroomId: string }) => {
    setLoading(true);

    try {
      const res = await fetch("/api/chatrooms", {
        method: "DELETE",
        body: JSON.stringify({
          chatroomId,
        }),
        headers: {
          "Content-Type": "application/json", // 添加 Content-Type 頭部
        },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }

      // 如果需要處理回應的話，可以在這裡繼續執行相關邏輯

      router.refresh();
    } catch (error) {
      console.error("Error deleting chatroom:", error);
    } finally {
      setLoading(false);
    }
  };

  const announceChatroom = async ({
    chatroomId,
    content,
  }: {
    chatroomId: string;
    content: string | JSX.Element[];
  }) => {
    setLoading(true);

    try {
      const res = await fetch("/api/chatrooms", {
        method: "PUT",
        body: JSON.stringify({
          chatroomId,
          content,
        }),
        headers: {
          "Content-Type": "application/json", // 添加 Content-Type 頭部
        },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }

      // 如果需要處理回應的話，可以在這裡繼續執行相關邏輯

      router.refresh();
    } catch (error) {
      console.error("Error annoucing message:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createChatroom,
    loading,
    deleteChatroom,
    announceChatroom,
  };
}

//   const createChatroom = async ({
//     toUser,
//     currentUser,
//   }: {
//     toUser:string,
//     currentUser:string;
//   }) => {
//     setLoading(true);

//     const res = await fetch("/api/chatrooms", {
//       method: "POST",
//       body: JSON.stringify({
//         toUser,
//         currentUser,
//       }),
//     });

//     if (!res.ok) {
//       const body = await res.json();
//       throw new Error(body.error);
//     }
//     const response = await res.json();

//     // const newChatroomId = response;
//     router.refresh();
//     setLoading(false);

//     // return newChatroomId;

//   const deleteChatroom = async({
//     chatroomId,

//   }:{
//     chatroomId:string
//   }) => {
//     setLoading(true);
//     const res = await fetch("/api/chatrooms",{
//       method: "DELETE",
//       body: JSON.stringify({
//         chatroomId,

//       }),
//     });
//     if(!res.ok){
//       const body = await res.json();
//       throw new Error(body.error);
//     }
//     // const response = await res.json();
//     router.refresh();
//   }

//   };
//   return {
//     createChatroom,
//     loading,
//     deleteChatroom,
//   }
// }
