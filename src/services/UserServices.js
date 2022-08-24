import { deleteMethod, get, post, postFile } from "./AxiosHelper";

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
};

export default UserService;
