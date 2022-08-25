import { useEffect, useState } from "react";
import UserService from "../services/UserServices";

export const useGetCurrentUserInfo = (data) => {
  const [UserInfo, setUserInfo] = useState();
  useEffect(() => {
    UserService.getCurrentUser().then((res) => setUserInfo(res.data));
  }, []);

  return UserInfo;
};
