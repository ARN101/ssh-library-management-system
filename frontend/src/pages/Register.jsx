import { Button, Form, Input, Layout, Typography, Card, Alert } from "antd";
import { useRegisterMutation } from "../redux/features/auth/authApi.js";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks.js";
import {
  useCurrentToken,
  selectCurrentUser,
} from "../redux/features/auth/authSlice.js";
import {
  kuetEmailRules,
  deriveRoleFromEmail,
  isKuetEmail,
} from "../utils/validation.js";

const { Title, Text } = Typography;

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [emailHint, setEmailHint] = useState("");
  const token = useAppSelector(useCurrentToken);
  const currentUser = useAppSelector(selectCurrentUser);

  if (token) {
    return (
      <Navigate
        to={
          currentUser?.role === "librarian"
            ? "/admin/book-inventory"
            : "/student/book-catalog"
        }
        replace
      />
    );
  }

  const onFinish = async (values) => {
    try {
      const res = await register(values).unwrap();
      const role = res?.data?.user?.role || deriveRoleFromEmail(values.email);
      toast.success(
        role === "librarian"
          ? "Librarian account created. Please log in."
          : "Registered successfully. Please log in."
      );
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to register");
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(160deg, #e8f1ff 0%, #f7f9fc 45%, #ffffff 100%)",
      }}
    >
      <Card style={{ width: 420, padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>
            SSH Library
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Create a new account
          </Text>
        </div>

        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Domain roles"
          description={
            <>
              <div>@stud.kuet.ac.bd → student</div>
              <div>@kuet.ac.bd → librarian</div>
            </>
          }
        />

        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input size="large" placeholder="Your full name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={kuetEmailRules}>
            <Input
              size="large"
              placeholder="name@stud.kuet.ac.bd"
              onChange={(e) => {
                const value = e.target.value;
                if (isKuetEmail(value)) {
                  setEmailHint(`Will register as ${deriveRoleFromEmail(value)}`);
                } else {
                  setEmailHint("");
                }
              }}
            />
          </Form.Item>
          {emailHint && (
            <Text
              type="secondary"
              style={{ display: "block", marginTop: -12, marginBottom: 12 }}
            >
              {emailHint}
            </Text>
          )}

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password size="large" placeholder="At least 6 characters" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </Layout>
  );
};

export default Register;
