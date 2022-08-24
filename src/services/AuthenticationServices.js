import { post } from "./AxiosHelper";

const AuthenticationService = {
  loginRequest(data) {
    return post("/user/login", data);
  },
  registerRequest(data) {
    return post("/user/register", data);
  },
  logOutRequest(){
    return post("/user/register");
  }
};

export default AuthenticationService;
