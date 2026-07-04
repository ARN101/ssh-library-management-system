import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks.js";
import { selectCurrentUser } from "../../redux/features/auth/authSlice.js";
import {
  BookOutlined,
  AppstoreOutlined,
  ReadOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || "student";

  // Build menu items based on user role
  const menuItems =
    role === "librarian"
      ? [
          {
            key: "/admin/book-inventory",
            icon: <AppstoreOutlined />,
            label: "Book Inventory",
          },
        ]
      : [
          {
            key: "/student/book-catalog",
            icon: <ReadOutlined />,
            label: "Book Catalog",
          },
        ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // Determine which menu item is active based on current path
  const selectedKey = menuItems.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key || menuItems[0]?.key;

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div
        style={{
          color: "white",
          textAlign: "center",
          padding: "16px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <BookOutlined style={{ marginRight: 8 }} />
        SSH Library
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
