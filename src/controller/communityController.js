import { routes } from "../utils/constants";
import { getUser } from "../utils/utils";

export const community = (req, res) => {
  const user = getUser();
  res.render("community", { routes, user, pageTitle: "Community | OOS" });
};
