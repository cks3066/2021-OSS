import "core-js/stable";
import "regenerator-runtime";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  authService,
  createDocument,
  dbService,
  updateDocument,
} from "./firebase";
import { DB_COLLECTIONS, routes } from "../../utils/constants";
import { isLoggedIn } from "./utils";
import { collection, getDocs, query, where } from "@firebase/firestore";

const btnChangeMode = document.getElementById("btn-modeChange");
const authForm = document.getElementById("authForm");
const authFormSpan = document.getElementById("authFormSpan");
const authFormTitle = document.getElementById("authFormTitle");
const btnBack = document.getElementById("btnBack");
const formEmailInput = document.getElementById("formEmailInput");
const formPasswordInput = document.getElementById("formPasswordInput");
const googleLoginBtn = document.getElementById("googleLoginBtn");

const handleClickToChangeMode = () => {
  console.log("changeMode!");
  switch (authForm.action) {
    case `http://${window.location.host}/signIn`:
      console.log("change mode to login");
      authForm.action = `http://${window.location.host}/login`;
      authFormSpan.innerText = "로그인";
      authFormTitle.innerText = "로그인";
      btnChangeMode.innerText = "회원가입하기";
      googleLoginBtn.style.display = "block";
      break;
    case `http://${window.location.host}/login`:
      console.log("change mode to register");
      authForm.action = `http://${window.location.host}/signIn`;
      authFormSpan.innerText = "회원가입";
      authFormTitle.innerText = "회원가입";
      btnChangeMode.innerText = "로그인하기";
      googleLoginBtn.style.display = "none";
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
    console.log(credential);
    if (credential?.user) {
      window.location.href = routes.home;
    }
  } catch (error) {
    alert(error);
  }
};

const handleClickToLoginWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(
      authService,
      new GoogleAuthProvider()
    );
    if (user) {
      // query to search user already register, if so, then should not execute rest of this func
      const q = query(
        collection(dbService, DB_COLLECTIONS.USER),
        where("email", "==", user.email)
      );
      const resultQ = await getDocs(q);
      if (resultQ.docs.length > 0) {
        alert("이미 등록 되셨군요.");
        window.location.href = routes.home;
        return;
      }

      const { displayName, photoURL, email, uid } = user;
      const { ok, error, id } = await createDocument(DB_COLLECTIONS.USER, {
        displayName,
        photoURL,
        email,
        uid,
        commentIds: [],
        id: null,
        postIds: [],
      });

      if (!ok || error) {
        console.log(error);
        alert(error);
        return;
      }

      const { error: updateErr, ok: updateOk } = await updateDocument(
        DB_COLLECTIONS.USER,
        id,
        {
          id,
        }
      );

      if (!updateOk || updateErr) {
        console.log(error);
        alert(error);
        return;
      }

      alert("성공적 구글 로그인");
      window.location.href = routes.home;
    }
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const init = () => {
  if (isLoggedIn()) {
    alert("이미 로그인 하셨습니다.");
    window.location.href = routes.home;
  }
  if (btnChangeMode) {
    btnChangeMode.addEventListener("click", handleClickToChangeMode);
  }
  if (btnBack) {
    btnBack.addEventListener("click", handleClickToExit);
  }
  if (authForm) {
    authForm.addEventListener("submit", handleSubmitToAuth);
  }
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", handleClickToLoginWithGoogle);
  }
  document.body.hidden = false;
};

const preload = () => {
  document.body.hidden = true;

  setTimeout(init, 1000);
};

document.addEventListener("DOMContentLoaded", preload);
