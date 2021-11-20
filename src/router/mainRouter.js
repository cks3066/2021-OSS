import express from "express";
import {
  home,
  auth,
  chatRoom,
  chatRooms,
  community,
  communityPostDetail,
  createCommunityPost,
  profile,
} from "../controller/mainController";
import { routes } from "../utils/constants";

export const mainRouter = express.Router();

//home
mainRouter.get(routes.home, home);
//auth
mainRouter.get(routes.auth, auth);
//community
mainRouter.get(routes.community, community);
//createCommunityPost
mainRouter.get(routes.createCommunityPost, createCommunityPost);
//communityPost
mainRouter.get(routes.communityPostDetail(), communityPostDetail);
//chatRooms
mainRouter.get(routes.chatRooms, chatRooms);
// chatRoom
mainRouter.get(routes.chatRoom(), chatRoom);
//profile
mainRouter.get(routes.profile(), profile);
