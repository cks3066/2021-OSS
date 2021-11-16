import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { routes } from "../../utils/constants";
import { getUserByUid, isLoggedIn, updateUser, uploadImg } from "./utils";
import { authService } from "./firebase";

const hrefParsed = window.location.href.split("/");
const profileId = hrefParsed[hrefParsed.length - 1];

const container = document.getElementById("container");
let updateButton;

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const img = document.getElementById("profileImage");

const Button =
  "<button id = 'updateButton' class = 'w-36 h-full ml-auto text-center border border-black rounded-full hover:bg-black hover:text-white transition ease-linear'>프로필 수정</button>";

//프로필 수정버튼 클릭시 생성될 인터페이스

const updateDisplay =
  "<div id = 'update'>" +
  "<div id = 'profileImg'>" +
  "<label>" +
  "<input class = 'w-52 h-8 hidden mx-auto my-2'" +
  "type='file'" +
  "name='fileUploader'" +
  "id = 'profileUploader'" +
  "/>" +
  "<div class = 'w-52 h-8 leading-8 mx-auto my-2 text-center border border-black rounded-full hover:bg-red-500 hover:text-white transition ease-linear cursor-pointer'>프로필 이미지 변경</div>" +
  "</label>" +
  "</div>" +
  "<input id = 'passwdFirst' type = 'password' placeholder='비밀번호 변경' class = 'w-52 h-8 mx-auto my-2 border border-black rounded-full text-center block'>" +
  "<input id = 'passwdSecond' type = 'password' placeholder='비밀번호 확인' class = 'w-52 h-8 mx-auto my-2 border border-black rounded-full text-center block'>" +
  "<input id = 'displayName' type = 'text' placeholder='닉네임 변경' class = 'w-52 h-8 mx-auto my-2 border border-black rounded-full text-center block'>" +
  "<div>" +
  "</div>" +
  "</div>";

const updateDisplayName = async () => {
  let newName = null;
  const displayName = document.getElementById("displayName");

  if (displayName != null) {
    newName = displayName.value;
    updateUser(profileId, { displayName: newName });
    alert("닉네임이 변경되었습니다.");
  }
};

//비밀번호 업데이트
const updatePasswd = async () => {
  const passwdFirst = document.getElementById("passwdFirst");
  const passwdSecond = document.getElementById("passwdSecond");

  if (passwdFirst == null && passwdSecond == null) {
    return;
  }

  let newPasswd1 = passwdFirst.value;
  let newPasswd2 = passwdSecond.value;

  console.log(newPasswd1);
  console.log(newPasswd2);

  if (newPasswd1 === "" && newPasswd2 === "") {
    return;
  } else if (newPasswd1 === newPasswd2) {
    const { ok, error } = await updateUser(profileId, { password: newPasswd2 });

    if (!ok || error) {
      console.log("requires-recent-login");
      alert(error);
      await authService.signOut();
      window.location.reload;
    } else {
      console.log("checkout firebase");
    }
    alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
  } else {
    alert("비밀번호가 다릅니다.");
  }
};

const updateImage = async () => {
  const uploader = document.getElementById("profileUploader");

  console.log(uploader);
  if (uploader) {
    uploader.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      console.log(file);
      try {
        const url = await uploadImg(file);
        if (url) {
          if (img && img.tagName === "IMG") {
            img.src = url;
            console.log(url);
            updateUser(profileId, { photoURL: url });
          }
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    });
  }
};

//프로필 수정버튼 클릭시 바뀔 화면 & update
const changeInfoDisplay = async () => {
  if (updateButton.innerText === "프로필 수정") {
    updateButton.innerHTML = "수정 완료";
    container.insertAdjacentHTML("beforeend", updateDisplay);
  } else if (updateButton.innerText === "수정 완료") {
    updateDisplayName();
    updatePasswd();
    preload();
  }
};

const clickUpdateButton = async () => {
  try {
    //uid 판별을 위한 호출
    const { error, ok } = await updateUser(profileId, {});

    if (ok) {
      changeInfoDisplay();
      updateImage();
    } else {
      alert("프로필을 수정할 수 없습니다.");
      alert(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const showUserInfo = async () => {
  const profileUser = await getUserByUid(profileId);

  img.src = profileUser.photoURL;

  if (profileUser.displayName == null) {
    userName.innerText = "설정된 닉네임이 없습니다.";
  } else {
    userName.innerText = "User Display Name : " + profileUser.displayName;
  }
  userEmail.innerText = "User Email : " + profileUser.email;
};

const checkProfileUser = async () => {
  if (isLoggedIn()) {
    const { error, ok } = await updateUser(profileId, {});
    const buttonContainer = document.getElementById("updateInfo");

    if (ok) {
      buttonContainer.innerHTML = Button;
      updateButton = document.getElementById("updateButton");

      if (updateButton) {
        updateButton.addEventListener("click", clickUpdateButton);
      }
    }
  }
};

const init = async () => {
  try {
    await updateMenuBar();
    await checkProfileUser();
    await showUserInfo();
  } catch (error) {
    console.log(error);
  }
  document.body.hidden = false;
};

const preload = () => {
  const removeTag = document.getElementById("update");

  //프로필 수정 인터페이스 제거
  if (removeTag) {
    container.removeChild(removeTag);
  }
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
