import { deleteMethod, get, post } from "./AxiosHelper";

const TodoService = {
  getAllItems(params) {
    return get("/task", params);
  },
  addTodo(data) {
    return post("/task", data);
  },
  editTodo(id, data) {
    return post("/user/editstudent/" + id, data);
  },
  getStudentDetail(id) {
    return get("/user/getstudentdetail", id);
  },
  dropTodo(id) {
    return deleteMethod("/task", id);
  },
};

export default TodoService;
