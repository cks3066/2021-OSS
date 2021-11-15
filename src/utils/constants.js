export const routes = {
  home: "/",
  auth: "/auth",
  login: "/login",
  signIn: "/signIn",
  logout: "/logout",
  community: "/community",
  createCommunityPost: "/community/create",
  chatRooms: "/chatRooms",
  communityPostDetail: (postId) =>
    postId ? `/community/${postId}` : `/community/:postId`,
  chatRoom: (chatRoomId) =>
    chatRoomId ? `/chatRoom/${chatRoomId}` : `/chatRoom/:chatRoomId`,
};

export const DB_COLLECTIONS = {
  USER: "user",
  COMMUNITY_POST: "communityPost",
  COMMUNITY_COMMENT: "communityComment",
  CHAT_ROOM: "chatRoom",
  CHAT_ROOM_MSG: "chatRoomMsg",
};
