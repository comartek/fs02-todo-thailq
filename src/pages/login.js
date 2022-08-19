import { SmileOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    await axios
      .post("https://api-nodejs-todolist.herokuapp.com/user/login", {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        document.cookie = "token=" + res.data.token;
        openNotification(res.statusText);
        navigate("/home");
      })
      .catch(function (error) {
        openNotification(error.response.data);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const openNotification = (mess) => {
    notification.open({
      message: mess,
      icon: (
        <SmileOutlined
          style={{
            color: "#108ee9",
          }}
        />
      ),
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        title="Login"
        bordered={false}
        style={{
          width: 800,
        }}
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
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
