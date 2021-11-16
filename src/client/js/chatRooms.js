import "core-js/stable";
import "regenerator-runtime/runtime";
import { routes } from "../../utils/constants";
import { authService } from "./firebase";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import {
  createChatRoom,
  getAllUsers,
  getChatRooms,
  getUserByUid,
  isLoggedIn,
} from "./utils";

const chatRoomsContainer = document.getElementById("chatRoomsContainer");
const createChatRoomBtn = document.getElementById("createChatRoomBtn");
const createChatRoomModal = document.getElementById("createChatRoomModal");
const createChatRoomModalBg = document.getElementById("createChatRoomModalBg");
const createChatRoomUserContainer = document.getElementById(
  "createChatRoomUserContainer"
);
let chatRooms = [];
let users = [];

const handleCreateNewChatRoom = async (uid) => {
  try {
    const { ok, chatRoomId, error } = await createChatRoom(uid);
    if (!ok || error) {
      console.log(error);
      alert(error);
      return;
    }

    window.location.href = routes.chatRoom(chatRoomId);
    return;
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const createUserBanner = (user) => {
  const div = document.createElement("div");
  const title = document.createElement("h1");

  title.innerText = user.email;

  div.className =
    "flex justify-center items-center w-full h-full ring-4 ring-green-700 bg-green-500 text-white rounded-2xl hover:scale-105 transition-all transform cursor-pointer";

  title.className = "font-semibold w-2/3  break-words";

  div.appendChild(title);

  div.addEventListener("click", () => handleCreateNewChatRoom(user.uid));
  createChatRoomUserContainer.appendChild(div);
};

const createChatRoomBanner = async (chatRoom) => {
  const div = document.createElement("div");
  const link = document.createElement("a");
  const title = document.createElement("span");
  const msgIndicateDiv = document.createElement("div");
  const msgIcon = document.createElement("i");
  const msgSpan = document.createElement("span");

  const youUid = chatRoom.participantIds.filter(
    (id) => id !== authService.currentUser.uid
  )[0];

  if (youUid) {
    const you = await getUserByUid(youUid);
    if (you) {
      title.innerText = `${you.displayName || you.email}님과의 대화`;
    }
  }

  link.href = routes.chatRoom(chatRoom.id);

  link.className =
    "flex justify-between items-center w-full p-5 my-5 bg-gray-200 ring ring-green-600 rounded-2xl hover:bg-green-500 transition-all hover:text-white";

  title.className = "text-xl font-medium";

  msgIndicateDiv.className = "flex items-center";

  msgIcon.className = "fas fa-comment-alt text-2xl mr-3";

  msgSpan.className = "text-lg font-medium";

  msgSpan.innerText = chatRoom.msgs.length;

  msgIndicateDiv.appendChild(msgIcon);
  msgIndicateDiv.appendChild(msgSpan);

  link.appendChild(title);
  link.appendChild(msgIndicateDiv);

  div.appendChild(link);

  chatRoomsContainer.appendChild(div);
};

const loadChatRooms = async () => {
  const { ok, chatRooms: chatRoomsData, error } = await getChatRooms();
  if (!ok || error) {
    alert(error);
    return;
  }
  chatRooms = chatRoomsData;
};

const handleToCreateChatRoom = () => {
  createChatRoomModal.style.display = "flex";
  document.body.style.overflow = "hidden";
};

const handleToExitCreateChatRoomMode = () => {
  createChatRoomModal.style.display = "none";
  document.body.style.overflow = "";
};

const init = async () => {
  try {
    await updateMenuBar();

    if (!isLoggedIn()) {
      alert("로그인 후에 이용 가능합니다.");
      window.location.href = routes.home;
      return;
    }

    users = await getAllUsers();
    users.forEach((user) => createUserBanner(user));
    await loadChatRooms();
    chatRooms.forEach((room) => createChatRoomBanner(room));
  } catch (error) {
    console.log(error);
    alert(error);
  }

  console.log(users);

  // addEventListener
  if (createChatRoomBtn) {
    createChatRoomBtn.addEventListener("click", handleToCreateChatRoom);
  }

  if (createChatRoomModal) {
    createChatRoomModalBg.addEventListener(
      "click",
      handleToExitCreateChatRoomMode
    );
  }

  document.body.hidden = false;
};

const preload = () => {
  setTimeout(init, 1000);
};

document.body.hidden = true;
document.addEventListener("DOMContentLoaded", preload);
