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
  updateUser,
  uploadImg,
} from "./utils";
import { authService } from "./firebase";
import { async } from 'regenerator-runtime';

const updateButton = document.getElementById("updateButton");
const container = document.getElementById("container");
const updateDisplay =
"<div id = 'update'>"
+ "<div id = 'profileImg'>"
  + "<label>"
    + "<input class = 'hidden'"
      + "type='file'"
      + "name='fileUploader'"
      + "id = 'profileUploader'"
    + "/>"
  + "<div class = 'w-52 h-8 leading-8 mx-auto my-2 text-center border border-black rounded-full hover:bg-red-500 hover:text-white transition ease-linear cursor-pointer'>프로필 이미지 변경</div>"
+ "</label>"
  + "</div>"
    + "<input id = 'passwdFirst' type = 'password' placeholder='비밀번호 변경' class = 'w-52 h-8 mx-auto my-2 border border-black rounded-full text-center block'>"
    + "<input id = 'passwdSecond' type = 'password' placeholder='비밀번호 확인' class = 'w-52 h-8 mx-auto my-2 border border-black rounded-full text-center block'>"
    + "<input id = 'displayName' type = 'text' placeholder='닉네임 변경' class = 'w-52 h-8 mx-auto my-2 border border-black rounded-full text-center block'>"
  + "<div>"
+ "</div>"
+ "</div>";


const chageImage = () => {
  const uploader = document.getElementById("profileUploader");
  const img = document.getElementById("profileImage");

  uploader.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    console.log(file);
    try{
      const url = await uploadImg(file);
      if(url){
        if(img && img.tagName === "IMG") {
          img.src = url;
          return url;
        }
      }
    }
    catch (error){
      console.log(error);
      alert(error);
    }
  });
}

//프로필 수정시 바뀔 화면
const changeInfoDisplay = async () => {
  
  if(updateButton.innerText === '프로필 수정'){
    updateButton.innerHTML = '수정 완료';
    container.insertAdjacentHTML('beforeend', updateDisplay);
  }
  else{
    updateButton.innerText = '프로필 수정'
    const insertedContent = document.getElementById("update");
    if(insertedContent) {
      insertedContent.parentNode.removeChild(insertedContent);
    }
  }
}

const clickUpdateButton = async () => {
  try {
    const user = await getUser();
    const hrefParsed = window.location.href.split("/");
    const profileId = hrefParsed[hrefParsed.length - 1];
    //const updateData = { newPasswd, newphotoURL, newDisplayName };
    
    //uid 판별을 위한 호출
    const { error, ok } = await updateUser(user.uid , {});
    
    if (ok) {
      changeInfoDisplay();
    } else {
      alert("프로필을 수정할 수 없습니다.");
      alert(error);
    }
  } catch (error) {
    console.log(error);
  }
}

const init = async () => {
  document.body.hidden = false;
  updateMenuBar();
  
  if (updateButton) {
    updateButton.addEventListener("click", clickUpdateButton);
  }
};

const preload = () => {
  document.body.hidden = true;
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
