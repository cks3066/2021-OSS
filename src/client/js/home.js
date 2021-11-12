import "core-js/stable";
import { async } from 'regenerator-runtime';
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import "./utils";
import { getUser } from './utils';

const init = async () => {
  document.body.hidden = false;

  //현재 로그인 유저 프로필 주소
  const currentUser = await getUser();
  const link = document.getElementById('profileLink')
  const a = document.createElement("a");
  a.innerText = "프로필";
  link.appendChild(a);
  a.href = `/profile/${currentUser.uid}`;
  a.className =
    "hover:text-white hover:bg-black transition ease-linear rounded-3xl border border-black text-xl inline-block w-full h-full";

  updateMenuBar();
};

const preload = () => {
  document.body.hidden = true;
  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
