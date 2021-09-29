import express from "express";
import {
  auth,
  home,
  login,
  logout,
  signIn,
  test,
} from "../controller/homeController";
import { routes } from "../utils/constants";

export const homeRouter = express.Router();

//home
homeRouter.get(routes.home, home);
//auth
homeRouter.get(routes.auth, auth);
//login
homeRouter.post(routes.login, login);
//signIn
homeRouter.post(routes.signIn, signIn);
//logout
homeRouter.get(routes.logout, logout);
