export const routes = {
  home: "/",
  auth: "/auth",
  login: "/login",
  signIn: "/signIn",
  logout: "/logout",
  community: "/community",
  createCommunityPost: "/community/create",
  communityPostDetail: (postId) =>
    postId ? `/community/${postId}` : `/community/:postId`,
  profile: (uid) => (uid ? `/profile/${uid}` : `/profile/:uid`),
  };

export const DB_COLLECTIONS = {
  USER: "user",
  COMMUNITY_POST: "communityPost",
};
