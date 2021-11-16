import express from "express";
import {
  community,
  communityPostDetail,
  createCommunityPost,
} from "../controller/communityController";
import { auth, chatRoom, chatRooms, home } from "../controller/homeController";
import { auth, home } from "../controller/homeController";
import { profile } from "../controller/profileController";
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
