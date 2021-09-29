const init = () => {
  const btnChangeMode = document.getElementById("btn-modeChange");
  const authForm = document.getElementById("authForm");
  const authFormSpan = document.getElementById("authFormSpan");
  const authFormTitle = document.getElementById("authFormTitle");
  const btnBack = document.getElementById("btnBack");

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

  if (btnChangeMode) {
    btnChangeMode.addEventListener("click", handleClickToChangeMode);
  }
  if (btnBack) {
    btnBack.addEventListener("click", handleClickToExit);
  }
};

document.addEventListener("DOMContentLoaded", init);
