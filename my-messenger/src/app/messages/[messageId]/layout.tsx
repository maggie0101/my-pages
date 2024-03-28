import ChatRoom from "./_components/ChatRoom";

type Props = {
  children: React.ReactNode;
  params: { messageId: string };
};

export default async function ChatRoomLayout({ children, params }: Props) {
  return (
    <>
      <ChatRoom chatroomId={params.messageId} />
      {children}
    </>
  );
}
