import { Button, Form, Input, Layout, Typography, Card } from "antd";
import { useRegisterMutation } from "../redux/features/auth/authApi.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const { Title } = Typography;

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await register(values).unwrap();
      toast.success("Registered successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to register");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 400, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>SSH Library</Title>
          <Typography.Text type="secondary" style={{ fontSize: '16px' }}>Create a new account</Typography.Text>
        </div>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input size="large" />
          </Form.Item>

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
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </Layout>
  );
};

export default Register;
