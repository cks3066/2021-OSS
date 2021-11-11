import express from "express";
import {
  community,
  communityPostDetail,
  createCommunityPost,
} from "../controller/communityController";
import { auth, home, somethingNew } from "../controller/homeController";
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
