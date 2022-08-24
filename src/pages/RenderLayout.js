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
import AuthenticationService from "../services/AuthenticationServices";
import TodoService from "../services/TodoServices";
import UserService from "../services/UserServices";

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
    TodoService.getAllItems().then((res) =>
      setPagination({ ...pagination, total: res.data.count })
    );
  };
  const fetchTodo = (limitItem, currentPage) => {
    setLoading(true);
    TodoService.getAllItems({
      limit: limitItem,
      skip: (currentPage - 1) * 10,
    }).then((res) => {
      setTodoList(res.data.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    UserService.getCurrentUser().then((res) => setUserName(res.data.name));
    fetchTotalItem();
    fetchTodo(10, 1);
  }, []);

  const onFinish = (value) => {
    TodoService.addTodo({
      description: value.content.toString(),
    }).then((res) => {
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
    TodoService.editTodo(record._id, {
      completed: !record.completed,
    }).then(() => fetchTodo());
  };
  const handleEditTodoName = (value, record) => {
    TodoService.editTodo(record._id, {
      description: value,
    }).then(() => fetchTodo());
  };
  const deleteTodo = (record, index) => {
    TodoService.dropTodo(record._id).then(() => {
      fetchTodo();
      fetchTotalItem();
    });
  };
  function delete_cookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    AuthenticationService.logOutRequest().then(() => navigate("/login"));
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
      TodoService.getAllItems({ completed: true }).then((res) => {
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
