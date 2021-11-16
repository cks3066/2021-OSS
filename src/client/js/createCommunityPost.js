import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { routes } from "../../utils/constants";
import { createEditor } from "./editor";
import {
  createCommunityPost,
  deleteImgFromFirebase,
  getUser,
  isLoggedIn,
} from "./utils";
import { authService } from "./firebase";

const editorContainer = document.querySelector(".editor");
const homeCancelPostButton = document.getElementById("homeCancelPostButton");
const homeCreatePostButton = document.getElementById("homeCreatePostButton");
const postTitle = document.getElementById("postTitle");

const handleClickToCancelPost = async (editorObj) => {
  const editor = editorObj.quill;
  const imgUrlList = editorObj.imgUrlList;
  console.log(imgUrlList);
  if (Array.isArray(imgUrlList) && imgUrlList.length > 0) {
    for (const imgUrl of imgUrlList) {
      await deleteImgFromFirebase(imgUrl);
    }
  }
  editorObj.imgUrlList.splice(0, editorObj.imgUrlList.length);
  editor.setText("");
  postTitle.innerText = "";
};

const handleClickToCreatePost = async (editorObj) => {
  const imgUrlList = editorObj.imgUrlList;
  let editorHTML = null;

  if (postTitle.value === "") {
    alert("제목은 필수입니다.");
    return;
  }

  if (editorContainer) {
    const qlEditor = editorContainer.querySelector(".ql-editor");
    editorHTML = qlEditor.innerHTML;
  }

  //data는 createCommunityPost의 내부에 들어가는 인자로 저희 노션 문서에 자세히 적혀져 있습니다. 궁금하면 직접 함수를 찾아 보셔도 됩니다.
  const data = {
    title: postTitle.value,
    postBody: editorHTML,
    imgUrlList,
  };
  console.log(data);
  try {
    const { error, ok, postId } = await createCommunityPost(data);
    if (ok) {
      window.location.href = routes.communityPostDetail(postId);
    } else {
      alert("post 생성에 실패했습니다.");
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  if (!isLoggedIn()) {
    alert("해당 페이지는 로그인 후에 이용할 수 있습니다.");
    window.location.href = routes.auth;
  }
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
