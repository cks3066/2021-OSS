import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { routes } from "../../utils/constants";
import { createEditor } from "./editor";
import {
  deleteImgFromFirebase,
  getUser,
  isLoggedIn,
} from "./utils";
import { authService } from "./firebase";

const init = async () => {
  // if (!isLoggedIn()) {
  //   alert("해당 페이지는 로그인 후에 이용할 수 있습니다.");
  //   window.location.href = routes.auth;
  // }
  try {
    document.body.hidden = false;

    updateMenuBar();

    const editorObj = createEditor(".editor");
    homeCancelPostButton.onclick = () => handleClickToCancelPost(editorObj);
    homeCreatePostButton.onclick = () => handleClickToCreatePost(editorObj);
  } catch (error) {
    console.log(error);
  }
};

const preload = () => {
  document.body.hidden = true;
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
