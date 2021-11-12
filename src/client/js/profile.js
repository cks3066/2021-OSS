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
  document.body.hidden = false;

  updateMenuBar();
};

const preload = () => {
  document.body.hidden = true;
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
