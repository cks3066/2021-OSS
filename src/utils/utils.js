import { authService } from "./firebase";

export const getUser = () => {
  let user = null;
  if (authService.currentUser) {
    user = authService.currentUser;
  }

  return user;
};
