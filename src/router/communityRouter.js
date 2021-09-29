import express from "express";
import { community } from "../controller/communityController";
import { routes } from "../utils/constants";

export const communityRouter = express.Router();

communityRouter.get(routes.home, community);
