import { routes } from "../utils/constants";

//홈페이지에 접속할 시에 동작하는 컨트롤러
export const home = async (req, res) => {
  res.render("home", { routes, pageTitle: "Home | KwangGround" });
};

//auth 페이지로 접속한 경우 동작하는 컨트롤러
export const auth = async (req, res) => {
  res.render("auth", { routes, pageTitle: "Auth | KwangGround" });
};

export const chatRooms = (req, res) => {
  res.render("chatRooms", { routes, pageTitle: "ChatRooms | KwangGround" });
};

export const chatRoom = (req, res) => {
  res.render("chatRoom", { routes, pageTitle: `ChatRoom | KwangGround` });
};
