import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@firebase/auth";
import { authService } from "../utils/firebase";
import { routes } from "../utils/constants";
import { getUser } from "../utils/utils";

export const home = (req, res) => {
  const user = getUser();
  res.render("home", { routes, user, pageTitle: "Home | OOS" });
};

export const auth = (req, res) => {
  const user = getUser();
  if (user) {
    console.log("이미 로그인 한 상태입니다.");
    res.redirect(routes.home);
    return;
  }
  res.render("auth", { routes, pageTitle: "Auth | OOS" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== "" && password !== "") {
      const credential = await signInWithEmailAndPassword(
        authService,
        email,
        password
      );

      if (credential) {
        res.redirect(routes.home);
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== "" && password !== "") {
      const credential = await createUserWithEmailAndPassword(
        authService,
        email,
        password
      );

      if (credential) {
        res.redirect(routes.home);
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const logout = async (req, res) => {
  const user = getUser();
  if (!user) {
    res.redirect(routes.home);
    return;
  }

  try {
    await authService.signOut();
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect(routes.home);
  }
};
