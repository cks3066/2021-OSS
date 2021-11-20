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

//프로필 페이지 컨트롤러
export const profile = (req, res) => {
  return res.render("profile", {
    routes,
    pageTitle: "profile | KwangGround",
  });
};

//community 페이지에 접속하게 되면 사용 되는 컨트롤러 함수
export const community = (req, res) => {
  res.render("community", {
    routes,
    pageTitle: "Community | KwangGround",
  });
};

//특정 포스트를 선택하는 경우 보여지는 해당 포스트의 자세한 내용에 대한 페이지 컨트롤러
export const communityPostDetail = (req, res) => {
  return res.render("communityPostDetail", {
    routes,
    pageTitle: "PostDetail | KwangGround",
  });
};

export const createCommunityPost = (req, res) => {
  return res.render("createCommunityPost", {
    routes,
    pageTitle: "createCommunityPost | KwangGround",
  });
};
