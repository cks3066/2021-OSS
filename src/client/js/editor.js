import Quill from "quill";
import { getUser } from "./utils";
import { v4 as uuid } from "uuid";
import { storageService } from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const createEditor = (containerSelector) => {
  let imgUrlList = [];

  const uploadImg = async (imgData) => {
    try {
      if (!imgData) {
        console.log({
          ok: false,
          error: "함수를 실행시키기에 적합한 인자가 들어오지 않았습니다.",
        });
      }

      const user = await getUser();
      if (!user) {
        console.log({
          ok: false,
          error: "해당 기능은 로그인 한 후에 이용할 수 있습니다.",
        });
        return;
      }

      const imgRef = ref(storageService, `${user.uid || uuid()}/${uuid()}`);
      await uploadString(imgRef, imgData, "data_url");

      const downloadURL = await getDownloadURL(imgRef);
      if (downloadURL !== "") {
        const editor = quill;
        const range = editor?.getSelection().index;

        if (range !== null && range !== undefined) {
          editor?.setSelection(range, 1);
          editor?.clipboard.dangerouslyPasteHTML(
            range,
            `<img src=${downloadURL} alt=imgAlt />`
          );
        }
        imgUrlList.push(downloadURL);
        console.log(imgUrlList);
      } else {
        console.log("Failed to upload img to firebase");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fileToUrl = (file) => {
    const reader = new FileReader();
    //reader.readAsDataURL(file);
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      if (e.target?.result) {
        await uploadImg(e.target.result);
      }
    };
  };
  const imageHandler = () => {
    // 파일을 업로드 하기 위한 input 태그 생성
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    console.log("time to handle image!");

    // 파일이 input 태그에 담기면 실행 될 함수
    input.onchange = () => {
      const file = input.files;
      if (file !== null) {
        fileToUrl(file[0]);
      }
    };
  };

  const options = {
    modules: {
      toolbar: {
        container: [
          [{ header: [false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["video", "image"],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          ["clean"],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
    },
    placeholder: "글을 입력해 보세요.",
    readOnly: false,
    theme: "snow",
  };
  const quill = new Quill(containerSelector, options);

  return { quill, imgUrlList };
};
