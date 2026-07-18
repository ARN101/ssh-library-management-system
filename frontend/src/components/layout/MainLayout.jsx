import { Button, Layout, Typography } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.js";
import { logOut, selectCurrentUser } from "../../redux/features/auth/authSlice.js";
import { useLogoutMutation } from "../../redux/features/auth/authApi.js";
import { toast } from "sonner";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Clear local session even if the network call fails
    } finally {
      dispatch(logOut());
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 16,
            padding: "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {user?.name && (
            <Text type="secondary">
              {user.name}
              {user.role ? ` · ${user.role}` : ""}
            </Text>
          )}
          <Button onClick={handleLogout} danger loading={isLoading}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "auto" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          SSH Library Management System ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
