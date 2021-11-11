import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { getCommunityPosts } from "./utils";

const postsContainer = document.getElementById("postsContainer");
let posts = null;

const loadPosts = async () => {
  try {
    posts = await getCommunityPosts();
  } catch (error) {
    console.log(error);
  }
};

const displayPostUI = (posts) => {
  for (const post of posts) {
    createPostUI(post);
  }
};

const createPostUI = (post) => {
  const { title, id } = post;
  const a = document.createElement("a");
  const span = document.createElement("span");
  span.innerText = title || "untitled";
  a.appendChild(span);
  a.href = `/community/${id}`;
  a.className =
    "border border-gray-500 p-5 hover:bg-gray-500 transition-all rounded-2xl";
  postsContainer.appendChild(a);
};

const init = async () => {
  document.body.hidden = false;
  displayPostUI(posts);
  console.log(posts);
  updateMenuBar();
};

const preload = async () => {
  document.body.hidden = true;
  await loadPosts();
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
