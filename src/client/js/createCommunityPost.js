import "core-js/stable";
import "regenerator-runtime/runtime";
import "./menuBar";
import { updateMenuBar } from "./menuBar";
import { routes } from "../../utils/constants";
import { createEditor } from "./editor";
import {
  createCommunityPost,
  deleteImgFromFirebase,
  isLoggedIn,
} from "./utils";

// editorContainer는 기본적으로 editor를 감싸주는 wrapper div라고 보시면 됩니다.
const editorContainer = document.querySelector(".editor");
// 에디터에서 작성한 내용을 지우기 위한 버튼 엘리먼트입니다.
const homeCancelPostButton = document.getElementById("homeCancelPostButton");
// 에디터에서 작성한 내용을 파이어베이스 DB로 보내기 위한 버튼 엘리먼트입니다.
const homeCreatePostButton = document.getElementById("homeCreatePostButton");
// 포스트에 사용 될 제목을 적어두는 input 엘리먼트입니다.
const postTitle = document.getElementById("postTitle");

// 해당 함수는 유저가 에디터에서 작성한 내용을 파이어베이스 서버로 보내지 않고, 취소하는 경우 사용 되는 이벤트 핸들러입니다.
// 인자로 editorObj 라는 에디터 객체를 받게 되는데 해당 내부에는 에디터 객체인 editor와 에디터에 사용 된 이미지 url 배열이 속성 값으로 담겨 있습니다.
const handleClickToCancelPost = async (editorObj) => {
  // 우선 editorObj에 있는 editor 객체 quill과 이미지 url 배열 imgUrlList를 변수에 담아줍니다.
  const editor = editorObj.quill;
  const imgUrlList = editorObj.imgUrlList;
  // 유저가 에디터를 사용하여 사진을 넣었다면 해당 사진은 이미 에디터에 담겨 있는 순간 파이어베이스 서버로 전송 되어 DB에 저장되어 있습니다. 따라서 현재 함수가 유저가 작성하던 내용을 없던 것으로 만들어 주는 함수기에 해당 파이어베이스에 저장되어 있는 이미지들도 같이 지워줄 필요가 있습니다. 그래서 imgUrlList 라는 배열이 필요한 것이고, 해당 배열이 비어있지 않다면, for문을 돌면서 해당 값을 지워줍니다. 지워줄 때는 deleteImgFromFirebase 라는 파이어베이스와 소통하는 함수를 사용하게 되는데 단순하게 올바른 이미지 url 문자열 값을 넘겨주면 해당 이미지를 DB에서 지워준다고 생각하시면 됩니다.
  if (Array.isArray(imgUrlList) && imgUrlList.length > 0) {
    for (const imgUrl of imgUrlList) {
      await deleteImgFromFirebase(imgUrl);
    }
  }
  // 에디터에 있는 이미지 값들을 지웠다면, imgUrlList에 담겨 있는 url 들은 의미없는 url이 되었기에 url들을 지워줍니다. 다만 여기서 editorObj.imgUrlList를 새로운 배열로 할당하거나 그러면 스코프의 범위가 달라져 에디터 내부에서 동작하던 사진 업로드 함수가 동작하지 않을 수도 있습니다. 따라서 splice를 이용하여 기존 배열을 유지하며 내부 값만 지워주는 역할을 수행합니다.
  editorObj.imgUrlList.splice(0, editorObj.imgUrlList.length);
  // 그 후에 editor에서 지원하는 setText 함수를 사용하여 에디터 내부 글들을 지워주고(빈 문자열로 만들어 줌)
  editor.setText("");
  // 포스트의 제목 역시 비워줍니다.
  postTitle.innerText = "";
};

// 해당 함수는 유저가 에디터에 글을 작성하고, 파이어베이스로 포스트를 등록하겠다는 의미로 제출 버튼을 클릭하면 발생하는 이벤트 핸들러입니다.
const handleClickToCreatePost = async (editorObj) => {
  // 인자는 동일하게 editorObj가 들어오게 되고, 여기서 editor 객체 자체를 사용하진 않습니다. 우리에게 필요한 것은 이미지 url이기에 해당 값만 변수에 저장해 줍니다.
  const imgUrlList = editorObj.imgUrlList;
  // editorHTML은 post 데이터 스키마에 postBody에 해당하는 부분으로 html 태그들을 문자열로 저장해 둔 값들이 들어오게 됩니다. 그리고 해당 값은 DB로 전송되어 보관되어 있다가, 유저가 특정 포스트를 보고 싶어 하면, 해당 포스트에 대한 정보를 DB로 부터 받아와서 postBody 부분을 특정 div의 innerHTML로 설정해주면 포스트가 적절하게 유저에게 보여지게 됩니다.
  let editorHTML = null;

  // 만약 제목을 정하지 않았다면 포스트를 만들 수 없기에 alert 자바스크립트 내장 함수로 에러 메세지를 표시해주고 무조건 여기서 return을 해주셔야 다음 코드로 진입이 되지 않고, 이벤트 핸들러가 종료 되기에 이렇게 에러 처리를 해주셔야 합니다.
  if (postTitle.value === "") {
    alert("제목은 필수입니다.");
    return;
  }
  
  // editorContainer를 찾는 이부분은 앞서 살펴 본 editorHTML에 값을 집어 넣기 위한 작업을 하는 부분입니다.
  // qlEditor라는 변수에는 .ql-editor 라는 Quilljs 라는 에디터 라이브러리에서 제공하는 에디터의 쓴 글들이 태그의 형태로 저장 되는 공간입니다.
  // 따라서 해당 공간을 찾아서 innerHTML의 값을 가져오면 유저가 에디터에서 작성한 글 혹은 이미지들을 가져와 DB에 저장할 수 있고, 이를 다시 꺼내어 특정 div에 innetHTML 속성 값으로 주게 되면 포스트가 정상적으로 보여지게 됩니다.
  if (editorContainer) {
    const qlEditor = editorContainer.querySelector(".ql-editor");
    editorHTML = qlEditor.innerHTML;
  }

  
  //data는 createCommunityPost의 내부에 들어가는 인자로 저희 노션 문서에 자세히 적혀져 있습니다. 궁금하면 직접 함수를 찾아 보셔도 됩니다.
  const data = {
    title: postTitle.value,
    postBody: editorHTML,
    imgUrlList,
  };
  try {
    const { error, ok, postId } = await createCommunityPost(data);
    if (ok) {
      // 만약 포스트를 성공적으로 DB에 생성했다면 해당 포스트를 자세히 볼 수 있는 communityPostDetail 페이지로 넘어가게 됩니다.
      // window.location.href에 특정 주소값을 넣어주면 브라우저는 해당 주소로 현재 페이지를 바꾸게 됩니다. 네이버나 구글도 가능합니다.
      window.location.href = routes.communityPostDetail(postId);
    } else {
      // 만약 모종의 이유로 실패했다면 실패했다는 alert 문구와 함께 브라우저 콘솔에 에러 메세지가 등장하니 보고 디버깅해주시면 됩니다.
      alert("post 생성에 실패했습니다.");
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  if (!isLoggedIn()) {
    alert("해당 페이지는 로그인 후에 이용할 수 있습니다.");
    window.location.href = routes.auth;
  }
  try {
    document.body.hidden = false;

    // updateMenuBar는 저희 맨 위에 달려 있는 메뉴바에서 유저가 로그인 했는지 안했는지를 확인하여 View가 다르게 보여지게 하기 위해 사용하는 함수입니다.
    updateMenuBar();

    // 해당 부분에서 editorObj를 선언해주고 있습니다. 함수는 createEditor이며 내부 인자로 들어오는 값은 쿼리스트링값입니다. 쿼리스트링이란 특정 엘리먼트를 찾을 수 있게 해주는 역할을 하는 특수한 문자열인데, 여기선 클래스 이름이 editor 인 div를 찾고 있습니다.
    const editorObj = createEditor(".editor");
    // 앞서 살펴본 여러 버튼들에 이벤트를 걸어주는 부분입니다.
    homeCancelPostButton.onclick = () => handleClickToCancelPost(editorObj);
    homeCreatePostButton.onclick = () => handleClickToCreatePost(editorObj);
  } catch (error) {
    console.log(error);
  }
};

// preload 함수가 필요한 이유는 파이어베이스에서 유저 정보를 받아와 현재 유저가 로그인한 상태인지 아닌지를 판단하기 위해 1초정도를 잠시 대기하며 해당 정보를 받아오는 시간을 확보하는 함수라고 보면 됩니다.
// 그러기에 일단 전체를 hidden을 true로 주어 안보이게 숨겨두고 init 함수에서 다시 보이게끔 hidden을 false로 바꿔주고 있습니다.
const preload = () => {
  document.body.hidden = true;
  setTimeout(init, 1000);
};

// 해당 코드는 거의 대부분의 페이지에서 공통적으로 쓰이는 코드로 DOM이 로드가 완료 되면 preload 라는 함수를 실행시키라는 의미입니다.
document.addEventListener("DOMContentLoaded", preload);
