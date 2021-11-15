import "core-js/stable";
import "regenerator-runtime/runtime";
import { doc, onSnapshot } from "@firebase/firestore";
import { DB_COLLECTIONS, routes } from "../../utils/constants";
import { authService, dbService, queryDocument } from "./firebase";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import {
  createChatMsg,
  getChatRoom,
  getChatRoomMsg,
  getUser,
  isLoggedIn,
} from "./utils";

const userName = document.getElementById("userName");
const userNoAvatarIcon = document.getElementById("userNoAvatarIcon");
const userInfoContainer = document.getElementById("userInfoContainer");
const chatContainer = document.getElementById("chatContainer");
const chatEditor = document.getElementById("chatEditor");
const chatSendButton = document.getElementById("chatSendButton");
let chatRoomId = "";
let chatRoom = null;
let me = null;
let you = null;
let msgs = [];

const parseMeandYou = async (chatRoom) => {
  if (chatRoom) {
    try {
      const participantIds = chatRoom.participantIds;

      if (Array.isArray(participantIds) && participantIds.length === 2) {
        const yourUid = participantIds.filter(
          (id) => id !== authService.currentUser.uid
        )[0];

        console.log("yourUid : " + yourUid);

        if (yourUid) {
          const {
            ok,
            documentData: youData,
            error,
          } = await queryDocument(DB_COLLECTIONS.USER, "uid", "==", yourUid);
          if (!ok || error) {
            throw new Error(error);
          }

          you = youData;
          me = await getUser();
        }
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
};

const loadChatRoom = async () => {
  try {
    chatRoomId = window.location.href.split("/");
    chatRoomId = chatRoomId[chatRoomId.length - 1];
    const { chatRoomData } = await getChatRoom(chatRoomId);

    if (chatRoomData) {
      await parseMeandYou(chatRoomData);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const handleClickToSendChat = async () => {
  const chatMsg = chatEditor.value;
  if (chatMsg.length > 0) {
    const { ok, error } = await createChatMsg(
      chatRoomId,
      me.uid,
      you.uid,
      chatMsg
    );
    if (!ok || error) {
      alert(error);
      return;
    }
    chatEditor.value = "";
  } else {
    alert("한 글자 이상 입력해야 합니다.");
  }
};

const createNewMsgOnDisplay = async (docMsgs) => {
  for (const docMsg of docMsgs) {
    const isNewMsg = msgs.find((msg) => msg === docMsg);
    if (!isNewMsg) {
      // create New one
      const { ok, chatRoomMsg, error } = await getChatRoomMsg(docMsg);

      if (ok) {
        const container = document.createElement("div");
        const body = document.createElement("span");
        body.innerText = chatRoomMsg.text;
        container.className =
          "p-5 px-10 mt-5 font-medium text-xl flex justify-center items-center rounded-2xl";
        if (chatRoomMsg.fromId === authService.currentUser.uid) {
          container.classList.add("self-end", "bg-green-500", "text-white");
        } else {
          container.classList.add("self-start", "bg-gray-500");
        }

        container.appendChild(body);
        chatContainer.appendChild(container);
      } else {
        console.log(error);
      }
    }
  }
  msgs = [...docMsgs];
};

const init = async () => {
  try {
    await updateMenuBar();

    if (!isLoggedIn()) {
      alert("해당 페이지는 로그인이 필요합니다.");
      window.location.href = routes.home;
      return;
    }

    await loadChatRoom();

    if (!me || !you) {
      alert("채팅방 유저 정보가 잘못 되었습니다.");
      console.log(me, you);
      return;
    }

    if (userName) {
      userName.innerText = `${you.displayName || you.email}님과의 대화`;
      if (you.photoURL && userNoAvatarIcon && userInfoContainer) {
        const avatar = document.createElement("a");

        userNoAvatarIcon.style.display = "none";
        avatar.style.backgroundImage = `url(${you.photoURL})`;
        avatar.className =
          "w-10 h-10 rounded-full bg-center bg-cover ring-2 ring-gray-800";

        userInfoContainer.appendChild(avatar);
      }

      if (chatSendButton) {
        chatSendButton.addEventListener("click", handleClickToSendChat);
      }

      onSnapshot(
        doc(dbService, `${DB_COLLECTIONS.CHAT_ROOM}/${chatRoomId}`),
        (doc) => {
          console.log("This is from onsnapshot");
          console.log(doc.data());
          if (doc.exists()) {
            const docMsgs = doc.get("msgs");
            createNewMsgOnDisplay(docMsgs);
          }
        }
      );

      document.body.hidden = false;
    }
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
