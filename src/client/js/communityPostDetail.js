import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { DB_COLLECTIONS, routes } from "../../utils/constants";
import {
  deleteCommunityPost,
  getPost,
  getUserByUid,
  getUser,
  isPostMine,
  createComment,
  getComments,
  isLoggedIn,
  getComment,
  deleteComment,
} from "./utils";
import { authService, updateDocument } from "./firebase";

const newPostButton = document.getElementById("newPostButton");
const deleteButton = document.getElementById("deleteButton");
const updateButton = document.getElementById("updateButton");
const commentButton = document.getElementById("commentButton");
const postBody = document.getElementById("postBody");
const postTitle = document.getElementById("postTitle");
const postUserID = document.getElementById("postUserID");
const postButtonContainer = document.getElementById("postButtonContainer");
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");
const commentCnt = document.getElementById("commentCnt");

let post = null;
let user = null;
let postId = null;
let comments = [];

const handleClickNewPost = async () => {
  window.location.href = routes.createCommunityPost;
};

const handleClickToDeletePost = async () => {
  const result = window.confirm("이 게시물을 삭제하시겠습니까?");
  if (result) {
    try {
      const hrefParsed = window.location.href.split("/");
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
  if (!isLoggedIn()) {
    alert("로그인 후에 이용 가능합니다.");
    return;
  }
  try {
    if (commentInput.value.length > 0) {
      const { ok, error, commentId } = await createComment({
        postId: post.id,
        commentBody: commentInput.value,
      });

      if (!ok || error) {
        alert(error);
        return;
      }

      const { comment } = await getComment(commentId);
      comments.push(comment);
      await commentOnDisplay(comment, true);

      commentInput.value = "";
    } else {
      alert("최소한 한글자 이상은 작성하셔야 합니다.");
    }
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const loadCommunityPost = async () => {
  try {
    postId = window.location.href.split("/");
    postId = postId[postId.length - 1];
    return getPost(postId);
  } catch (error) {
    console.log(error);
  }
};

const increaseView = async () => {
  try {
    if (post) {
      await updateDocument(DB_COLLECTIONS.COMMUNITY_POST, post.id, {
        views: post.views + 1,
      });
    }
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const loadComments = async () => {
  try {
    if (post) {
      const {
        ok,
        comments: fbComments,
        error,
      } = await getComments(post.commentIds);
      comments = fbComments.sort((a, b) => b.createdAt - a.createdAt);
    }
  } catch (error) {
    console.log(error);
  }
};

const handleClickToDeleteComment = async (comment) => {
  try {
    if (comment) {
      const deleteValidate = confirm("정말로 삭제하실겁니까?");
      if (deleteValidate) {
        const { ok, error } = await deleteComment(post.id, comment.id);
        if (!ok || error) {
          throw new Error(error);
        }
        window.location.reload();
      }
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const commentOnDisplay = async (comment, onFront) => {
  if (comment) {
    const commentDiv = document.createElement("div");
    const commentUsername = document.createElement("p");
    const commentContent = document.createElement("p");
    const underline = document.createElement("hr");
    const creator = await getUserByUid(comment.creatorId);

    commentDiv.className = "comment";
    commentUsername.className = "commentId";
    commentContent.className = "commentContent";

    commentUsername.innerText = creator.displayName || creator.email;
    commentContent.innerText = comment.commentBody;

    commentDiv.appendChild(commentUsername);
    commentDiv.appendChild(commentContent);

    if (comment.creatorId === authService.currentUser?.uid) {
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "삭제";
      deleteButton.className =
        "p-1 px-5 my-2  bg-red-500 rounded-2xl text-white";
      commentDiv.appendChild(deleteButton);
      deleteButton.addEventListener("click", () =>
        handleClickToDeleteComment(comment)
      );
    }

    commentDiv.appendChild(underline);

    if (onFront) {
      commentList.insertBefore(commentDiv, commentList.firstChild);
    } else {
      commentList.appendChild(commentDiv);
    }

    if (commentCnt) {
      commentCnt.innerText = `${comments.length}개의 댓글`;
    }
  }
};

const init = async () => {
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
  if (commentCnt) {
    commentCnt.innerText = `${post.commentIds.length}개의 댓글`;
  }

  const promise = getUserByUid(post.creatorId);
  promise.then(function (result) {
    postUserID.innerHTML = result.email;
  });

  if (user) {
    const isMine = isPostMine(user, post.id);
    if (isMine) {
      postButtonContainer.style.display = "flex";
    }
  }

  try {
    for (const comment of comments) {
      await commentOnDisplay(comment, false);
    }
  } catch (error) {
    console.log(error);
  }

  document.body.hidden = false;
};

const preload = async () => {
  post = await loadCommunityPost();
  user = await getUser();
  await increaseView();
  await loadComments();
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
