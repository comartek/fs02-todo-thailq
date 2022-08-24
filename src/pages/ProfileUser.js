import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, message, Upload } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import Cookies from "js-cookie";
import { trim } from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Row } from "reactstrap";
import UserService from "../services/UserServices";

function ProfileUser() {
  const [imageUrl, setImageUrl] = useState("");
  const [userLogged, setUserLogged] = useState();
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const fetchImg = () => {
    UserService.fetchImg(userLogged._id);
  };
  const fetchProfile = () => {
    UserService.getCurrentUser().then((res) => setUserLogged(res.data));
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (userLogged !== undefined) {
    }
  }, [userLogged]);

  const onFinish = async (values) => {};
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 10;

    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
      return;
    }
    var bodyFormData = new FormData();
    bodyFormData.append("avatar", file);
    axios
      .post(
        "https://api-nodejs-todolist.herokuapp.com/user/me/avatar",
        bodyFormData,
        {
          headers: {
            Authorization: Cookies.get().token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        fetchProfile();
        fetchImg();
      });
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  //   const handleChange = (info) => {
  //     console.log(info)
  //     // axios.put(
  //     //     "https://api-nodejs-todolist.herokuapp.com/user/me",
  //     //     {
  //     //       age: value,
  //     //     },
  //     //     {
  //     //       headers: {
  //     //         Authorization: Cookies.get().token,
  //     //         "Content-Type": "application/json",
  //     //       },
  //     //     }
  //     //   );
  //   };
  const handleSettingProfile = (value) => {
    axios.put(
      "https://api-nodejs-todolist.herokuapp.com/user/me",
      {
        age: value,
      },
      {
        headers: {
          Authorization: Cookies.get().token,
          "Content-Type": "application/json",
        },
      }
    );
  };

  if (userLogged === undefined) {
    return;
  }
  return (
    <Col lg="5" md="7" style={{ display: "flex", justifyContent: "center" }}>
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <Form
            {...layout}
            name="nest-messages"
            form={form}
            onFinish={onFinish}
          >
            <Row>
              <Col lg={24} md={24} sm={24} xs={24}>
                <h3>Profile Information</h3>
                <Row>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name={`fullName`}
                      style={{ whiteSpace: "normal" }}
                      label={"Full Name"}
                      labelCol={{ lg: 10, md: 24, sm: 24, xs: 24 }}
                      wrapperCol={{ lg: 24, md: 24, sm: 24, xs: 24 }}
                      labelAlign="left"
                      rules={[
                        {
                          required: true,
                          message: "Full Name is Required",
                        },
                        {
                          validator: (_, value) => {
                            return (value || "").length > 30
                              ? Promise.reject(
                                  new Error(
                                    "Length not more than 30 characters"
                                  )
                                )
                              : Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        placeholder="Full Name"
                        value={userLogged.name}
                        disabled={true}
                      />
                      <>{userLogged.fullName}</>
                    </Form.Item>

                    <Form.Item
                      name={`email`}
                      style={{ whiteSpace: "normal" }}
                      label={"Email"}
                      labelCol={{ lg: 10, sm: 24, xs: 24 }}
                      wrapperCol={{ lg: 24, sm: 24, xs: 24 }}
                      labelAlign="left"
                      normalize={(v) => {
                        return trim(v);
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Email is required",
                        },
                        {
                          validator: (_, value) => {
                            return (value || "").length > 100
                              ? Promise.reject(
                                  new Error(
                                    "Length not more than 100 characters"
                                  )
                                )
                              : Promise.resolve();
                          },
                        },
                      ]}
                    >
                      {/* <Input placeholder="Email" value={userLogged.email} /> */}
                      <>{userLogged.email}</>
                    </Form.Item>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={11} md={24} sm={24} xs={24}>
                    <Form.Item
                      name={`dob`}
                      style={{ whiteSpace: "normal" }}
                      label={"Age"}
                      labelCol={{ lg: 10, md: 24, sm: 24, xs: 24 }}
                      wrapperCol={{ lg: 24, md: 24, sm: 24, xs: 24 }}
                      labelAlign="left"
                      rules={[
                        {
                          required: true,
                          message: "Chưa nhập nội dung đề nghị",
                        },
                      ]}
                    >
                      <input
                        defaultValue={userLogged.age}
                        onBlur={(e) => handleSettingProfile(e.target.value)}
                      ></input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col lg={1}></Col>
              <Col lg={11} md={24} sm={24} xs={24}>
                <h3 className="mb-5">Avatar</h3>
                <Row>
                  <Col lg={7} md={24} sm={24} xs={24}>
                    {/* <input
                      type="file"
                      onChange={(e) => handleUploadImg(e)}
                    ></input> */}
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="http://localhost:3000/"
                      beforeUpload={beforeUpload}
                      //   onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img
                          key={Date.now()}
                          src={`https://api-nodejs-todolist.herokuapp.com/user/${userLogged._id}/avatar`}
                          alt="avatar"
                          style={{
                            width: "100%",
                          }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={16} md={24} sm={24} xs={24}>
                    <h3>Preview</h3>
                    <Avatar
                      key={Date.now()}
                      src={`https://api-nodejs-todolist.herokuapp.com/user/${userLogged._id}/avatar`}
                      size={300}
                    ></Avatar>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "10px",
              }}
            ></div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button>
                <Link to={"/home"}>Back</Link>
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
}

export default ProfileUser;
