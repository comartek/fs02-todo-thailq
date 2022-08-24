import { SmileOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenServices from "../services/AuthenticationServices";

function Register() {
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    await AuthenServices.registerRequest({
      name: values.email.split("@")[0],
      email: values.email,
      password: values.password,
      age: 20,
    })
      .then((res) => {
        openNotification(res.statusText);
        navigate("/login");
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
        title="Register"
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
            <Input.Password
              onChange={(values) => setPassword(values.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="checkpass"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value !== password) {
                    return Promise.reject("Password does not match");
                  }
                  return Promise.resolve();
                },
              }),
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
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
