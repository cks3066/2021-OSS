import { routes } from "../../utils/constants";
import { authService } from "./firebase";
import { getUser } from "./utils";

const menuBarLogout = document.getElementById("menuBarLogout");
const menuBarSignIn = document.getElementById("menuBarSignIn");
const menuBarProfileButton = document.getElementById("menuBarProfileButton");

export const updateMenuBar = async () => {
  const user = await getUser();
  const handleClickToLogOut = async (e) => {
    e.preventDefault();
    await authService.signOut();
    window.location.href = routes.home;
  };

  if (user) {
    menuBarLogout.hidden = false;
    menuBarSignIn.hidden = true;

    menuBarLogout.onclick = handleClickToLogOut;
    menuBarProfileButton.innerText = user.email;
    menuBarProfileButton.href = routes.profile(user.uid);
  } else {
    menuBarLogout.hidden = true;
    menuBarSignIn.hidden = false;
  }
};
