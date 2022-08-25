import { get, postFile, putUser } from "./AxiosHelper";

const UserService = {
  getCurrentUser() {
    return get("/user/me");
  },
  postAvatar(formData) {
    return postFile("/user/me/avatar", formData);
  },
  fetchImg(id) {
    return get("/user/" + id + "/avatar");
  },
  settingProfile(data) {
    return putUser("/user/me", data);
  },
};

export default UserService;
