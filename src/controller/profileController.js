import { routes } from "../utils/constants";

//프로필 페이지 컨트롤러
export const profile = (req, res) => {
    return res.render("profile", {
      routes,
      pageTitle: "profile | OOS",
    });
  };