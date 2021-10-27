import { DB_COLLECTIONS } from "../../utils/constants";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  authService,
  createDocument,
  dbService,
  deleteDocument,
  storageService,
  updateDocument,
} from "./firebase";
import { ref, deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid";

//현재 로그인 한 유저정보를 불러오는 함수.
export const getUser = async () => {
  let user = null;
  if (authService.currentUser) {
    const userQuery = query(
      collection(dbService, DB_COLLECTIONS.USER),
      where("uid", "==", authService.currentUser.uid)
    );
    const result = await getDocs(userQuery);

    for (const item of result.docs) {
      if (item.exists()) {
        user = item.data();
      }
    }
  }
  return user;
};

//해당 communityPost가 현재 로그인 한 유저의 것인지 파악하는 함수
export const isPostMine = (user, postId) => {
  const userPosts = user["postIds"];
  if (userPosts && Array.isArray(userPosts)) {
    const targetPostId = userPosts.find((userPostId) => userPostId === postId);
    if (!targetPostId) {
      return false;
    }
    return true;
  }

  return false;
};

//여러 communityPost들을 db로부터 불러 오는 함수
export const getCommunityPosts = async () => {
  try {
    const container = [];
    const result = await getDocs(
      query(collection(dbService, DB_COLLECTIONS.COMMUNITY_POST))
    );

    for (const item of result.docs) {
      if (item.exists()) {
        container.push(item.data());
      }
    }
    return container.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getPost = async (postId) => {
  try {
    let post = null;
    const docRef = doc(dbService, `${DB_COLLECTIONS.COMMUNITY_POST}/${postId}`);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
      post = docData.data();
    }
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteImgFromFirebase = async (url) => {
  console.log(url);
  try {
    const imgRef = ref(storageService, url);
    if (imgRef) {
      await deleteObject(imgRef);
    }
  } catch (error) {
    console.log(error);
  }
};

export const createCommunityPost = async (data) => {
  const { title, postBody, imgUrlList } = data;
  const user = await getUser();

  try {
    if (!Boolean(title) || !Boolean(postBody)) {
      return {
        ok: false,
        error: "인자로 적절한 값이 들어오지 않았습니다.",
      };
    }

    if (user == null) {
      return {
        ok: false,
        error: "현재 유저가 로그인하고 있지 않습니다.",
      };
    }

    const postData = {
      id: uuid(),
      title,
      postBody,
      creatorId: user.uid,
      commentIds: [],
      imgUrls: imgUrlList ? imgUrlList : [],
      views: 0,
      likes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
    };

    const {
      error,
      id: FBdocumentId,
      ok,
    } = await createDocument(DB_COLLECTIONS.COMMUNITY_POST, postData);

    if (!ok || error !== null) {
      return {
        ok: false,
        error: "파이어베이스에 정상적으로 도큐먼트를 생성하지 못했습니다.",
        postId: null,
      };
    }

    await updateDocument(DB_COLLECTIONS.COMMUNITY_POST, FBdocumentId, {
      id: FBdocumentId,
    });

    await updateDocument(DB_COLLECTIONS.USER, user.id, {
      postIds: [...user.postIds, FBdocumentId],
    });

    return {
      ok: true,
      postId: FBdocumentId,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error,
      postId: null,
    };
  }
};

//communityPost를 업데이트 해주는 함수
export const updateCommunityPost = async (postId, data) => {
  try {
    const { title, postBody, imgUrls, tags } = data;
    const user = await getUser();

    if (!Boolean(postId)) {
      return {
        ok: false,
        error: "postId가 주어지지 않았습니다.",
        postId: null,
      };
    }

    if (user == null) {
      return {
        ok: false,
        error: "해당 기능은 로그인 후에 이용할 수 있습니다.",
        postId: null,
      };
    }

    const myPost = isPostMine(user, postId);
    if (!myPost) {
      return {
        ok: false,
        error: "유저에게 해당 포스트를 수정할 권한이 없습니다.",
        postId: null,
      };
    }

    const updateData = {
      ...(title && { title }),
      ...(postBody && { postBody }),
      ...(imgUrls && { imgUrls }),
      ...(tags && { tags }),
    };

    const { error, ok } = await updateDocument(
      DB_COLLECTIONS.COMMUNITY_POST,
      postId,
      updateData
    );

    if (!ok || error) {
      return {
        ok,
        error,
        postId: null,
      };
    }

    return {
      ok: true,
      error: null,
      postId,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, error, postId: null };
  }
};

//communityPost를 delete 해주는 함수
export const deleteCommunityPost = async (postId) => {
  try {
    const user = await getUser();

    if (user == null) {
      return {
        ok: false,
        error: "해당 기능은 로그인 후에 사용할 수 있습니다.",
      };
    }

    const myPost = isPostMine(user, postId);
    if (!myPost) {
      return {
        ok: false,
        error: "유저에게 해당 포스트를 수정할 권한이 없습니다.",
      };
    }

    const { error, ok } = await deleteDocument(
      DB_COLLECTIONS.COMMUNITY_POST,
      postId
    );

    if (!ok || error) {
      return {
        ok,
        error,
      };
    }

    const filteredPostIds = user.postIds.filter((elem) => elem !== postId);
    await updateDocument(DB_COLLECTIONS.USER, user.id, {
      postIds: filteredPostIds,
    });

    return { ok: true, error: null };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error,
    };
  }
};

export const isLoggedIn = () => {
  return Boolean(authService.currentUser);
};
