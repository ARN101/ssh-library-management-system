import { Button, Form, Input, Layout, Typography, Card } from "antd";
import { useLoginMutation } from "../redux/features/auth/authApi.js";
import { useAppDispatch } from "../redux/hooks.js";
import { setUser } from "../redux/features/auth/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const { Title } = Typography;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 400, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>SSH Library</Title>
          <Typography.Text type="secondary" style={{ fontSize: '16px' }}>Please login to your account</Typography.Text>
        </div>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </Form>
      </Card>
    </Layout>
  );
};

export default Login;
