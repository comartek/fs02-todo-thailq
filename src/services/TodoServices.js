import { deleteMethod, get, post, put } from "./AxiosHelper";

const TodoService = {
  getAllItems(params) {
    return get("/task", params);
  },
  addTodo(data) {
    return post("/task", data);
  },
  editTodo(id, data) {
    return put("/task", id, data);
  },
  dropTodo(id) {
    return deleteMethod("/task", id);
  },
};

export default TodoService;
