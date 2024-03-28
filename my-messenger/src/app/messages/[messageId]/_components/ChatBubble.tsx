type ChatBubbleProps = {
  authorId: string;
  content: string | React.JSX.Element[];
  currentUser: string;
  chatroomId: string;
  chatId: string;
  onContextMenu: (
    event: React.MouseEvent<HTMLDivElement>,
    chatId: string,
  ) => void;
};
export default function ChatBubble({
  authorId,
  currentUser,
  content,
  chatId,
  onContextMenu,
}: ChatBubbleProps) {
  return (
    <div
      onContextMenu={(event) => onContextMenu(event, chatId)}
      className={`mx-2 my-1 max-w-xs rounded-lg p-4 ${
        authorId === currentUser
          ? "ml-auto self-end bg-blue-500 text-white"
          : "mr-auto bg-gray-200 text-black"
      }`}
    >
      {content}
    </div>
  );
}
