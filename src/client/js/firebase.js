import "core-js/stable";
import "regenerator-runtime/runtime";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN9wNlrWJPUawNIXp_6LnXkDwbOj_1pYI",
  authDomain: "oos-community.firebaseapp.com",
  projectId: "oos-community",
  storageBucket: "oos-community.appspot.com",
  messagingSenderId: "846619387078",
  appId: "1:846619387078:web:47c66449e537d58a5fe3c7",
};

const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);
export const dbService = getFirestore(app);
export const storageService = getStorage(app);

//db에 새로운 객체를 생성할때 사용하는 함수
export const createDocument = async (collectionName, data) => {
  try {
    const targetCollection = collection(dbService, collectionName);

    const result = await addDoc(targetCollection, data);
    return { ok: true, error: null, id: result.id };
  } catch (error) {
    console.log(error);
    return { ok: false, error, id: null };
  }
};

//db 내부에 존재하는 객체를 업데이트 할 때 사용하는 함수
export const updateDocument = async (collectionName, documentName, data) => {
  try {
    const targetDocument = doc(dbService, `${collectionName}/${documentName}`);
    const documentResult = await getDoc(targetDocument);
    if (documentResult.exists()) {
      await updateDoc(targetDocument, data);
      return { ok: true, error: null, id: targetDocument.id };
    }
  } catch (error) {
    console.log(error);
    return { ok: false, error, id: null };
  }
  return { ok: false, error: "updateDocument went wrong", id: null };
};

//db 내부 객체를 삭제할 때 사용하는 함수
export const deleteDocument = async (collectionName, documentName) => {
  try {
    const targetDocument = doc(dbService, `${collectionName}/${documentName}`);
    const documentResult = await getDoc(targetDocument);

    if (documentResult.exists()) {
      await deleteDoc(targetDocument);
      return { ok: true, error: null };
    }
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
  return { ok: false, error: "deleteDocument went wrong" };
};

// db 내부의 특정 객체를 조회할 때 사용하는 함수.
export const getDocument = async (collectionName, documentName) => {
  try {
    const targetDocument = doc(dbService, `${collectionName}/${documentName}`);
    const documentResult = await getDoc(targetDocument);

    if (documentResult.exists()) {
      return { ok: true, documentData: documentResult.data(), error: null };
    }
  } catch (error) {
    console.log(error);
    return { ok: false, error, documentData: null };
  }

  return { ok: false, error: "getDocument went wrong", documentData: null };
};

export const queryDocument = async (
  collectionName,
  queryCondition,
  queryOperation,
  queryValue
) => {
  try {
    const q = query(
      collection(dbService, collectionName),
      where(queryCondition, queryOperation, queryValue)
    );
    const queryResults = await getDocs(q);

    for (const queryResult of queryResults.docs) {
      if (queryResult.exists()) {
        return { ok: true, documentData: queryResult.data() };
      }
    }

    return {
      ok: false,
      error: `Failed to query FB ${collectionName} : ${queryCondition} : ${queryOperation} :  ${queryValue}`,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
};
