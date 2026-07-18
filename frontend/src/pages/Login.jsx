import { Button, Form, Input, Layout, Typography, Card } from "antd";
import { useLoginMutation } from "../redux/features/auth/authApi.js";
import { useAppDispatch, useAppSelector } from "../redux/hooks.js";
import {
  setUser,
  useCurrentToken,
  selectCurrentUser,
} from "../redux/features/auth/authSlice.js";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { kuetEmailRules } from "../utils/validation.js";

const { Title, Text } = Typography;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      const res = await login(values).unwrap();
      const user = res.data.user;
      dispatch(setUser({ user, token: res.data.accessToken }));
      toast.success("Logged in successfully");
      navigate(
        user?.role === "librarian"
          ? "/admin/book-inventory"
          : "/student/book-catalog",
        { replace: true }
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to login");
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
      <Card style={{ width: 400, padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>
            SSH Library
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Sign in with your KUET email
          </Text>
        </div>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Email" name="email" rules={kuetEmailRules}>
            <Input size="large" placeholder="name@stud.kuet.ac.bd" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </div>
        </Form>
      </Card>
    </Layout>
  );
};

export default Login;
