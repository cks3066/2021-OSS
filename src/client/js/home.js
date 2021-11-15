import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";

const init = async () => {
  document.body.hidden = false;
  updateMenuBar();
};

const preload = () => {
  setTimeout(init, 1000);
};

document.body.hidden = true;
document.addEventListener("DOMContentLoaded", preload);
