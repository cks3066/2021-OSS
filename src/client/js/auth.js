import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { authService, createDocument, updateDocument } from "./firebase";
import { DB_COLLECTIONS, routes } from "../../utils/constants";

const init = () => {
  const btnChangeMode = document.getElementById("btn-modeChange");
  const authForm = document.getElementById("authForm");
  const authFormSpan = document.getElementById("authFormSpan");
  const authFormTitle = document.getElementById("authFormTitle");
  const btnBack = document.getElementById("btnBack");
  const formEmailInput = document.getElementById("formEmailInput");
  const formPasswordInput = document.getElementById("formPasswordInput");

  const handleClickToChangeMode = () => {
    switch (authForm.action) {
      case `http://${window.location.host}/signIn`:
        authForm.action = `http://${window.location.host}/login`;
        authFormSpan.innerText = "로그인";
        authFormTitle.innerText = "로그인";
        btnChangeMode.innerText = "회원가입하기";
        break;
      case `http://${window.location.host}/login`:
        authForm.action = `http://${window.location.host}/signIn`;
        authFormSpan.innerText = "회원가입";
        authFormTitle.innerText = "회원가입";
        btnChangeMode.innerText = "로그인하기";

        break;
    }
  };

  const handleClickToExit = () => {
    console.log("working!!!");
    window.location.href = "/";
  };

  const handleSubmitToAuth = async (e) => {
    e.preventDefault();
    const email = formEmailInput.value;
    const password = formPasswordInput.value;
    let credential;

    console.log(email, password);
    if (email === "" || password === "") {
      alert("이메일 혹은 패스워드를 확인해 주십시오");
      return;
    }

    try {
      switch (authForm.action) {
        case `http://${window.location.host}/signIn`:
          // 회원가입을 하고 싶은 경우
          credential = await createUserWithEmailAndPassword(
            authService,
            email,
            password
          );
          if (credential) {
            const {
              user: { uid, email, displayName },
            } = credential;
            const userData = {
              uid,
              email,
              displayName,
              postIds: [],
              commentIds: [],
              id: null,
            };

            const {
              ok,
              error,
              id: FBUserDocumentId,
            } = await createDocument(DB_COLLECTIONS.USER, userData);
            if (!ok || error) {
              alert(error);
              return;
            }

            await updateDocument(DB_COLLECTIONS.USER, FBUserDocumentId, {
              id: FBUserDocumentId,
            });

            window.location.href = routes.home;
          }
          break;
        case `http://${window.location.host}/login`:
          // 로그인을 하고 싶은 경우
          credential = await signInWithEmailAndPassword(
            authService,
            email,
            password
          );
          break;
      }
      console.log(credential.user);
      if (credential?.user) {
        window.location.href = routes.home;
      }
    } catch (error) {
      alert(error);
    }
  };

  if (btnChangeMode) {
    btnChangeMode.addEventListener("click", handleClickToChangeMode);
  }
  if (btnBack) {
    btnBack.addEventListener("click", handleClickToExit);
  }
  if (authForm) {
    authForm.addEventListener("submit", handleSubmitToAuth);
  }
};

document.addEventListener("DOMContentLoaded", init);
