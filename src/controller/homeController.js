import { routes } from "../utils/constants";

//홈페이지에 접속할 시에 동작하는 컨트롤러
export const home = async (req, res) => {
  // const user = await getUser();
  // res.render("home", { routes, user, pageTitle: "Home | OOS" });
  res.render("home", { routes, pageTitle: "Home | OOS" });
};

//auth 페이지로 접속한 경우 동작하는 컨트롤러
export const auth = async (req, res) => {
  // const user = await getUser();
  // if (user) {
  //   console.log("이미 로그인 한 상태입니다.");
  //   res.redirect(routes.home);
  //   return;
  // }
  res.render("auth", { routes, pageTitle: "Auth | OOS" });
};

export const profile = (req, res) => {
  res.render("profile", { routes, pageTitle: "Profile | OOS"});
}
// //로그인을 시도하려 하면 동작하는 함수
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (email !== "" && password !== "") {
//       const credential = await signInWithEmailAndPassword(
//         authService,
//         email,
//         password
//       );

//       if (credential) {
//         res.redirect(routes.home);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.redirect(routes.home);
//   }
// };

//회원가입을 시도하려 하면 동작하는 함수
// export const signIn = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (email !== "" && password !== "") {
//       const credential = await createUserWithEmailAndPassword(
//         authService,
//         email,
//         password
//       );

//       if (credential) {
//         const {
//           user: { uid, email, displayName },
//         } = credential;
//         const userData = {
//           uid,
//           email,
//           displayName,
//           postIds: [],
//           commentIds: [],
//           id: null,
//         };

//         const {
//           ok,
//           error,
//           id: FBUserDocumentId,
//         } = await createDocument(DB_COLLECTIONS.USER, userData);
//         if (!ok || error) {
//           res.json({
//             ok: false,
//             error,
//           });
//         }

//         await updateDocument(DB_COLLECTIONS.USER, FBUserDocumentId, {
//           id: FBUserDocumentId,
//         });

//         res.redirect(routes.home);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.redirect(routes.home);
//   }
// };

// //로그아웃을 시도하려는 경우 동작하는 함수
// export const logout = async (req, res) => {
//   const user = await getUser();
//   if (!user) {
//     return res.redirect(routes.home);
//   }

//   try {
//     await authService.signOut();
//   } catch (error) {
//     console.log(error);
//   } finally {
//     res.redirect(routes.home);
//   }
// };
