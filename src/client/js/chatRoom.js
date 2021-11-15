import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { getChatRoom } from "./utils";

const userName = document.getElementById("userName");
const userNoAvatarIcon = document.getElementById("userNoAvatarIcon");
let chatRoomId = "";
let chatRoom = null;

const loadChatRoom = async () => {
  try {
    chatRoomId = window.location.href.split("/");
    chatRoomId = chatRoomId[chatRoomId.length - 1];
    chatRoom = await getChatRoom(chatRoomId);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const init = async () => {
  document.body.hidden = false;
  try {
    await updateMenuBar();
    await loadChatRoom();
    console.log(chatRoom);
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const preload = () => {
  setTimeout(init, 1000);
};

document.body.hidden = true;
document.addEventListener("DOMContentLoaded", preload);
