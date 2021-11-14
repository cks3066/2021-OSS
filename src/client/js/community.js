import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { getCommunityPosts } from "./utils";

const postsContainer = document.getElementById("postsContainer");
const buttonForSort = document.getElementsByClassName("button");
const viewedButton= document.getElementById("viewed");
const recentButton= document.getElementById("recent");
//viewedButton.addEventListener("click",handleClickToViewedButton);

const handleClickToViewedButton = async () => {  
    /*alert('1');
    
    document.body.hidden = true;
    await loadPosts();
    setTimeout(init, 1000);
    document.body.hidden=false;
    displayPostUI();
  */
    //location.reload();
    //postsContainer.removeChild();
    deleteChild(postsContainer);    
    await loadPosts(2);
    setTimeout(displayPostUI(posts), 1000);
    //displayPostUI();
};

const handleClickToRecentButton = async() => {
  deleteChild(postsContainer);
  await loadPosts(1);
  setTimeout(displayPostUI(posts), 1000);
}



function deleteChild(mydiv) {
  var child = mydiv.lastElementChild; 
  while (child) {
      mydiv.removeChild(child);
      child = mydiv.lastElementChild;
  }
}

/*
function myclick() {  
  alert('1');
  document.body.hidden = true;
  await loadPosts();
  setTimeout(init, 1000);
  document.body.hidden=false;
  displayPostUI();

};*/

let posts = null;

const loadPosts = async (type) => {
  try {
    posts = await getCommunityPosts(type);
  } catch (error) {
    console.log(error);
  }
};

const initTest = async () => {
  displayPostUI(posts);
};


const displayPostUI = (posts) => {
  for (const post of posts) {
    createPostUI(post);
  }
};


const deleteTag = (postBody) =>{
  const extract = /(<([^>]+)>)/ig;
  const eraseTag = postBody.replace(extract,"");
  return eraseTag;
}

function convertToDate(createdAt) {
  const now = new Date();
  const d =new Date(createdAt);
  const diffTime=(now.getTime()-d.getTime())/(1000*60*60);
  if(Math.floor(diffTime)<1){
    return Math.floor(diffTime*60)+"분 전";
  }
  else if(Math.floor(diffTime)>=24){
    return (d.toLocaleDateString()).slice(0,-1);
  }
  else{
    return Math.floor(diffTime)+"시간 전";
  }  
}

const createPostUI = (post) => {
  const { id,title,postBody,createdAt, createrId } = post;
  
  
  const post_div=document.createElement("div");
  const post_body_div=document.createElement("div");
  const post_body_a = document.createElement("a");
  const title_div_a = document.createElement("a");
  const title_div = document.createElement("div");
  const info_span = document.createElement("span");
  const postUser_span=document.createElement("span");
  
  if(post.imgUrls[0] != null){
    const img_a = document.createElement("a");
    const img_wrapper_div= document.createElement("div");
    const Img = document.createElement("img");
    
    img_wrapper_div.style.position ="relative";
    img_wrapper_div.style.height="50%";
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
    
    img_wrapper_div.appendChild(Img);
    img_a.appendChild(img_wrapper_div);
    post_div.appendChild(img_a);
  }  
  post_body_a.href = `/community/${id}`;
  title_div_a.href = `/community/${id}`;

  post_body_div.innerText = deleteTag(postBody) || "Nothing";
  post_body_div.style.overflow="hidden";
  post_body_div.style.textOverflow="ellipsis";
  post_body_div.style.display="-webkit-box";
  post_body_div.style.webkitLineClamp="4";
  post_body_div.style.webkitBoxOrient="vertical";
  post_body_div.style.wordBreak="break-all";
  post_body_div.style.height="25%";

  title_div.innerText = title || "untitled";

  title_div.style.height="10%";
  title_div.style.paddingTop="10px";
  title_div.style.paddingBottom="10px";
  title_div.style.fontWeight="bolder";
  title_div.style.fontSize="large";

  info_span.innerText = convertToDate(createdAt);
  info_span.style.paddingTop="10%";
  info_span.style.paddingLeft="5px";
  info_span.style.fontSize="smaller"
  info_span.style.color="saddlebrown"
  info_span.style.display="inline-block"

  //postUser_span.innerText =

  post_body_a.appendChild(post_body_div);
  title_div_a.appendChild(title_div);
  post_div.appendChild(title_div_a);
  post_div.appendChild(post_body_a);
  post_div.appendChild(info_span);

  post_div.className =
    "float-on-hover shadow-inner w-full border border-gray-300 p-5 rounded-2xl";  
  postsContainer.appendChild(post_div);
  
   
};

const init = async () => {
  document.body.hidden = false;
  displayPostUI(posts);
  console.log(posts);
  updateMenuBar();

  if (viewedButton) {
    viewedButton.addEventListener("click", handleClickToViewedButton);
  }

  if (recentButton) {
    recentButton.addEventListener("click", handleClickToRecentButton);
  }

};

const preload = async () => {
  document.body.hidden = true;
  await loadPosts(1);
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
