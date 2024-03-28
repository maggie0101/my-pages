import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import ChatList from "./_components/ChatList";
//import ChatRoom from "./_components/ChatRoom";
import SideBar from "./_components/SideBar";
import { getChatrooms } from "./_components/action";

type Props = {
  children: React.ReactNode;
};

export default async function MessagesPage({ children }: Props) {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const userId = session.user.id;
  const otherUsersInRoom = await getChatrooms(userId);

  return (
    <div className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
      <SideBar />
      <ChatList chatrooms={otherUsersInRoom} currentUser={userId} />
      {children}
    </div>
  );
}
