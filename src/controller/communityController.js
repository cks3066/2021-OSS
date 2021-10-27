import { routes } from "../utils/constants";

//community 페이지에 접속하게 되면 사용 되는 컨트롤러 함수
export const community = (req, res) => {
  res.render("community", {
    routes,
    pageTitle: "Community | OOS",
  });
};

//특정 포스트를 선택하는 경우 보여지는 해당 포스트의 자세한 내용에 대한 페이지 컨트롤러
export const communityPostDetail = (req, res) => {
  return res.render("communityPostDetail", {
    routes,
    pageTitle: "PostDetail | OOS",
  });
};

export const createCommunityPost = (req, res) => {
  return res.render("createCommunityPost", {
    routes,
    pageTitle: "createCommunityPost | OOS",
  });
};
