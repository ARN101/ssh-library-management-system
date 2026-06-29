import { Layout, Menu } from "antd";
const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div style={{ color: 'white', textAlign: 'center', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        SSH Library
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[{ key: '1', label: 'Dashboard' }]}
      />
    </Sider>
  );
};

export default Sidebar;
