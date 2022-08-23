import {
  Button,
  Form,
  Input,
  Layout,
  Modal,
  Radio,
  Select,
  Space,
  Table,
} from "antd";
import "antd/dist/antd.css";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { Option } from "antd/lib/mentions";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const RenderLayout = () => {
  const [userName, setUserName] = useState();
  const [loading, setLoading] = useState(false);
  const axios = require("axios").default;
  const navigate = useNavigate();
  const [todoList, setTodoList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchTotalItem = () => {
    axios
      .get("https://api-nodejs-todolist.herokuapp.com/task", {
        headers: {
          Authorization: Cookies.get().token,
        },
      })
      .then((res) => setPagination({ ...pagination, total: res.data.count }));
  };
  const fetchTodo = (limitItem, currentPage) => {
    setLoading(true);
    axios
      .get(
        "https://api-nodejs-todolist.herokuapp.com/task?limit=" +
          limitItem +
          "&skip=" +
          (currentPage - 1) * 10,
        {
          headers: {
            Authorization: Cookies.get().token,
          },
        }
      )
      .then((res) => {
        setTodoList(res.data.data);
        setLoading(false);
      });
  };
  useEffect(() => {
    axios
      .get("https://api-nodejs-todolist.herokuapp.com/user/me", {
        headers: {
          Authorization: Cookies.get().token,
        },
      })
      .then((res) => setUserName(res.data.name));
    fetchTotalItem();
    fetchTodo(10, 1);
  }, []);

  const onFinish = (value) => {
    axios
      .post(
        "https://api-nodejs-todolist.herokuapp.com/task",
        {
          description: value.content.toString(),
        },
        {
          headers: {
            Authorization: Cookies.get().token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        fetchTodo();
        fetchTotalItem();
      });
    setIsModalVisible(false);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const setStatus = (record, index) => {
    axios
      .put(
        "https://api-nodejs-todolist.herokuapp.com/task/" + record._id,
        {
          completed: !record.completed,
        },
        {
          headers: {
            Authorization: Cookies.get().token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => fetchTodo());
  };
  const handleEditTodoName = (value, record) => {
    axios
      .put(
        "https://api-nodejs-todolist.herokuapp.com/task/" + record._id,
        {
          description: value,
        },
        {
          headers: {
            Authorization: Cookies.get().token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => fetchTodo());
  };
  const deleteTodo = (record, index) => {
    axios
      .delete("https://api-nodejs-todolist.herokuapp.com/task/" + record._id, {
        headers: {
          Authorization: Cookies.get().token,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchTodo();
        fetchTotalItem();
      });
  };
  function delete_cookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    axios.post("https://api-nodejs-todolist.herokuapp.com/user/logout", {
      headers: {
        Authorization: Cookies.get().token,
      },
    });
    navigate("/login");
  }
  const handleTableChange = (newPagination, filters, sorter) => {
    fetchTodo(newPagination.pageSize, newPagination.current);
    setPagination({ ...pagination, current: newPagination.current });
    // fetchData({
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   pagination: newPagination,
    //   ...filters,
    // });
  };
  const handleFilterTable = (e) => {
    if (e !== "")
      axios
        .get("https://api-nodejs-todolist.herokuapp.com/task?completed=" + e, {
          headers: {
            Authorization: Cookies.get().token,
          },
        })
        .then((res) => {
          setTodoList(res.data.data);
          setLoading(false);
        });
    else fetchTodo(10, 1);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Content",
      dataIndex: "description",
      key: "description",
      render: (record, a, index, c) => {
        return (
          <input
            defaultValue={record}
            onBlur={(e) => handleEditTodoName(e.target.value, a)}
          ></input>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      render: (item) => (item ? "đã hoàn thành" : "chưa hoàn thành"),
    },
    {
      title: "Action",
      key: "action",
      render: (record, a, index, c) => (
        <Space size="middle">
          <Button onClick={() => setStatus(record, index)}>
            Chuyển trạng thái
          </Button>
          <Button onClick={() => deleteTodo(record, index)}>Xóa</Button>
        </Space>
      ),
    },
  ];
  return (
    <Layout className="layout">
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: "white" }}>
          <Link to={"profile"}>{userName}</Link>
        </p>
        <Button onClick={() => delete_cookie("token")}>Logout</Button>
      </Header>
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <Button type="primary flex justify-end mt-3 mb-3" onClick={showModal}>
          Add
        </Button>
        <Select
          defaultValue="All"
          style={{
            width: 120,
          }}
          onChange={(value) => handleFilterTable(value)}
        >
          <Option>All</Option>
          <Option value="true">Complete</Option>
          <Option value="false">not Done</Option>
        </Select>
        <Modal
          footer={<></>}
          title="Add To Do"
          visible={isModalVisible}
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="To do"
              name="content"
              rules={[
                {
                  required: true,
                  message: "Input todo!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          loading={loading}
          columns={columns}
          dataSource={todoList}
          rowKey="_id"
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      ></Footer>
    </Layout>
  );
};

export default RenderLayout;
