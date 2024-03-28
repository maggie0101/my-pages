"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import useChat from "@/hooks/useChat";
import useChatroom from "@/hooks/useChatroom";
import { type Chat } from "@/lib/types/db";

import ChatBubble from "./ChatBubble";

type ChatRoomContentProps = {
  chats: Chat[];
  currentUser: string;
  chatroomId: string;
};

export default function ChatRoomContent({
  currentUser,
  chatroomId,
  chats,
}: ChatRoomContentProps) {
  const { deleteChat, backChat } = useChat();
  const { announceChatroom } = useChatroom();
  const router = useRouter();
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [contextMenuChatId, setContextMenuChatId] = useState<string | null>(
    null,
  );
  const [contextMenuContent, setContextMenuContent] = useState<
    string | JSX.Element[] | null
  >(null);

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    chatId: string,
    authorId: string,
    content: string | JSX.Element[],
  ) => {
    event.preventDefault();
    if (authorId !== currentUser) {
      return;
    }

    // Show the context menu
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    setContextMenuVisible(true);

    // Store the chatId for further processing
    setContextMenuChatId(chatId);
    setContextMenuContent(content);
  };

  const handleMenuItemClick = async (
    action: string,
    contextMenuChatId: string,
    contextMenuContent: string | JSX.Element[],
  ) => {
    if (action === "back") {
      try {
        if (contextMenuChatId) {
          await deleteChat({ chatId: contextMenuChatId });
          router.refresh();
        }
      } catch (e) {
        console.log(e);
        alert(e);
      }
    } else if (action === "delete") {
      try {
        await backChat({ chatId: contextMenuChatId, currentUser: currentUser });
        router.refresh();
      } catch (e) {
        console.log(e);
        alert(e);
      }
    } else if (action === "announce") {
      try {
        await announceChatroom({
          chatroomId: chatroomId,
          content: contextMenuContent,
        });
        router.refresh();
      } catch (e) {
        console.log(e);
        alert(e);
      }
    }
    setContextMenuVisible(false);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const contextMenu = document.getElementById("contextmenu");
      if (
        isContextMenuVisible &&
        contextMenu &&
        !contextMenu.contains(event.target as Node)
      ) {
        setContextMenuVisible(false);
      }
    },
    [isContextMenuVisible],
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  // const handleClickOutside = (event: MouseEvent) => {
  //   // 如果右键菜单是可见的，且点击事件不是在右键菜单内的话，关闭右键菜单
  //   const contextMenu = document.getElementById('contextmenu'); // 替换为你的右键菜单的 id
  //   if (isContextMenuVisible && contextMenu && !contextMenu.contains(event.target as Node)) {
  //     setContextMenuVisible(false);
  //   }
  // };

  // useEffect(() => {
  //   // 添加点击事件监听器
  //   document.addEventListener('click', handleClickOutside);

  //   // 在组件卸载时移除事件监听器
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [isContextMenuVisible,handleClickOutside]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const renderMessageContent = (content: string): JSX.Element[] | string => {
    // 使用正则表达式检测链接
    const linkRegex = /(http[s]?:\/\/\S+)/g;
    const matches = content.match(linkRegex);

    if (matches) {
      // 将链接包装在 <a> 标签中
      return content.split(linkRegex).map((part, index) =>
        index % 2 === 0 ? (
          // 普通文本部分
          <span key={index}>{part}</span>
        ) : (
          // 链接部分
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ),
      );
    }

    return content;
  };

  return (
    <div className="overflow-y-scroll">
      {chats.map(
        (chat) =>
          (chat.notVisible === "none" || chat.notVisible !== currentUser) && (
            <ChatBubble
              key={chat.id}
              content={renderMessageContent(chat.content)}
              authorId={chat.authorId}
              currentUser={currentUser}
              chatroomId={chatroomId}
              chatId={chat.id}
              onContextMenu={(event) =>
                handleContextMenu(
                  event,
                  chat.id,
                  chat.authorId,
                  renderMessageContent(chat.content),
                )
              }
            />
          ),
      )}
      <div ref={chatContainerRef} />

      {/* 右键菜单 */}
      {isContextMenuVisible && (
        <div
          id="contextmenu"
          style={{
            position: "fixed",
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            padding: "8px",
            zIndex: 9999,
            // ...
          }}
        >
          {/* 右键菜单的内容 */}
          <div
            onClick={() =>
              handleMenuItemClick(
                "back",
                contextMenuChatId!,
                contextMenuContent!,
              )
            }
          >
            收回
          </div>
          <div
            onClick={() =>
              handleMenuItemClick(
                "delete",
                contextMenuChatId!,
                contextMenuContent!,
              )
            }
          >
            刪除
          </div>
          <div
            onClick={() =>
              handleMenuItemClick(
                "announce",
                contextMenuChatId!,
                contextMenuContent!,
              )
            }
          >
            公告
          </div>
        </div>
      )}
    </div>
  );
}
