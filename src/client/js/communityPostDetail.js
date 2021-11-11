import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { routes } from "../../utils/constants";
import {
  deleteCommunityPost,
  getPost,
  getUserByUid,
  getUser,
  isPostMine,
  createComment,
} from "./utils";

const newPostButton = document.getElementById("newPostButton");
const deleteButton = document.getElementById("deleteButton");
const updateButton = document.getElementById("updateButton");
const commentButton = document.getElementById("commentButton");
const postBody = document.getElementById("postBody");
const postTitle = document.getElementById("postTitle");
const postUserID = document.getElementById("postUserID");
const postButtonContainer = document.getElementById("postButtonContainer");

let post = null;
let user = null;

const handleClickNewPost = async () => {
  window.location.href = routes.createCommunityPost;
};

const handleClickToDeletePost = async () => {
  const result = window.confirm("이 게시물을 삭제하시겠습니까?");
  if (result) {
    try {
      const hrefParsed = window.location.href.split("/community/create/");
      const postId = hrefParsed[hrefParsed.length - 1];

      const { error, ok } = await deleteCommunityPost(postId);
      if (ok) {
        alert("성공적으로 포스트를 삭제했습니다.");
        window.location.href = routes.home;
      } else {
        alert("포스트 삭제에 실패했습니다.");
        alert(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const handleClickUpdate = async () => {
  window.alert("수정하기");
};

const handleClickComment = async () => {
  // 댓글 생성
  window.alert("댓글 작성");
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
  if (newPostButton) {
    newPostButton.addEventListener("click", handleClickNewPost);
  }
  if (updateButton) {
    updateButton.addEventListener("click", handleClickUpdate);
  }
  if (deleteButton) {
    deleteButton.addEventListener("click", handleClickToDeletePost);
  }
  if (commentButton) {
    commentButton.addEventListener("click", handleClickComment);
  }
  if (!post) {
    alert("올바르지 않은 접근입니다.");
    window.location.href = routes.home;
  }
  if (postBody) {
    postBody.innerHTML = post.postBody;
  }
  if (postTitle) {
    postTitle.innerHTML = post.title;
  }
  const promise = getUserByUid(post.creatorId);
  console.log(post);
  promise.then(function (result) {
    postUserID.innerHTML = result.email;
  });

  console.log(user);
  const isMine = isPostMine(user, post.id);
  if (isMine) {
    postButtonContainer.style.display = "flex";
  }

  console.log(routes);
};

const preload = async () => {
  document.body.hidden = true;
  post = await loadCommunityPost();
  user = await getUser();
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
