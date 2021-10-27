import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { routes } from "../../utils/constants";
import { deleteCommunityPost, getPost } from "./utils";

const deleteButton = document.getElementById("deleteButton");
const postContainer = document.getElementById("postContainer");
let post = null;

const handleClickToDeletePost = async () => {
  try {
    const hrefParsed = window.location.href.split("/");
    const postId = hrefParsed[hrefParsed.length - 1];

    const { error, ok } = await deleteCommunityPost(postId);
    if (ok) {
      alert("성공적으로 포스트를 삭제했습니다.");
    } else {
      alert("포스트 삭제에 실패했습니다.");
      alert(error);
    }
    window.location.href = routes.home;
  } catch (error) {
    console.log(error);
  }
};

const loadCommunityPost = async () => {
  try {
    let postId = window.location.href.split("/");
    postId = postId[postId.length - 1];
    return getPost(postId);
  } catch (error) {
    console.log(error);
  }
};

const init = () => {
  document.body.hidden = false;
  updateMenuBar();
  if (deleteButton) {
    deleteButton.addEventListener("click", handleClickToDeletePost);
  }
  if (!post) {
    alert("올바르지 않은 접근입니다.");
    window.location.href = routes.home;
  }
  if (postContainer) {
    postContainer.innerHTML = post.postBody;
  }
  console.log("welcome to communityPostDetail page");
};

const preload = async () => {
  document.body.hidden = true;
  post = await loadCommunityPost();
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
