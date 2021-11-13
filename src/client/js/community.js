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

const hasImg = (post) => {
  if(post.immgUrls[0] == null)
    return true;
  else 
    return false;
};

const deleteTag = (postBody) =>{
  const extract = /(<([^>]+)>)/ig;
  const eraseTag = postBody.replace(extract,"");
  return eraseTag;
}

const createPostUI = (post) => {
  const { id,title,postBody } = post;
  
  const post_div=document.createElement("div");
  const post_body_div=document.createElement("div");
  const post_body_a = document.createElement("a");
  const title_div = document.createElement("div");
  
  if(post.imgUrls[0] != null){
    const img_a = document.createElement("a");
    const img_wrapper_div= document.createElement("div");
    const Img = document.createElement("img");
    
    img_wrapper_div.style.position ="relative";
    img_wrapper_div.style.paddingTop="60%";
    img_wrapper_div.style.overflow="hidden";
  
    img_a.href = `/community/${id}`;

    Img.src= post.imgUrls[0];
    Img.style.position="absolute";
    Img.style.top="0";
    Img.style.left="0";
    Img.style.right="0";
    Img.style.bottom="0";
    Img.style.maxWidth="100%";
    Img.style.height="auto";
  //Img.style.objectFit="cover";

  img_wrapper_div.appendChild(Img);
  img_a.appendChild(img_wrapper_div);
  post_div.appendChild(img_a);
  }  
  post_body_a.href = `/community/${id}`;

  post_body_div.innerText = deleteTag(postBody) || "Nothing";
  post_body_div.style.overflow="hidden";
  post_body_div.style.textOverflow="ellipsis";
  post_body_div.style.display="-webkit-box";
  post_body_div.style.webkitLineClamp="5";
  post_body_div.style.webkitBoxOrient="vertical";
  post_body_div.style.wordBreak="break-all";
  post_body_div.style.minHeight="30%";

  title_div.innerText = title || "untitled";
  
  
  post_body_a.appendChild(post_body_div);
  post_div.appendChild(title_div);
  post_div.appendChild(post_body_a);
  
  post_div.className =
    "w-full border border-gray-500 p-5 hover:bg-gray-500 transition-all rounded-2xl";
  
  postsContainer.appendChild(post_div);
  
   
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
