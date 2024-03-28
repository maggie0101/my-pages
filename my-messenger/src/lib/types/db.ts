export type User = {
  id: string;
  username: string;
  email: string;
  provider: "github" | "credentials";
};

export type Chat = {
  id: string;
  authorId: string;
  chatroomId: string;
  content: string;
  createdAt: Date;
  notVisible: string;
};

// ChatRoom 的定義
export type ChatRoom = {
  id: string;

  displayId: string;
  createdAt: string;
};

export type ChatroomData = {
  userId: string;
  chatroomId: string;
  user: {
    username: string;
  };
  chatroom: {
    lastSentence: string;
  };
};
