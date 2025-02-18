import { Divider, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  FileTextOutlined,
  UserOutlined,
  FileAddOutlined,
  EditOutlined,
  FileExclamationOutlined,
  MoneyCollectOutlined,
  SafetyCertificateOutlined,
  CodeSandboxOutlined,
  GoldOutlined,
  CheckSquareOutlined,
  RollbackOutlined,
  ReconciliationOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { MdOutlineAddBox } from "react-icons/md";
import { BiTransferAlt } from "react-icons/bi";
import { TiFolderDelete } from "react-icons/ti";
import { CiPassport1 } from "react-icons/ci";
import { GoIssueReopened } from "react-icons/go";
import IconBtn from "./DKG_IconBtn";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice";
import { ActiveTabContext } from "../context/dashboardActiveTabContext";

const items = [
  {
    key: "1a",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    activeTab: 24,
    path: "/",
  },
  {
    key: "1b",
    icon: <UsergroupAddOutlined />,
    label: "Queue",
    activeTab: 23,
    path: "/",
  },
  {
    key: "1",
    icon: <FileAddOutlined />,
    label: "Indent Creation",
    activeTab: 1,
    path: "/",
  },
  {
    key: "2",
    icon: <FileDoneOutlined />,
    label: "Indent Approval",
    activeTab: 2,
    path: "/",
  },
  {
    key: "3",
    icon: <EditOutlined />,
    label: "Indent Modification",
    activeTab: 3,
    path: "/",
  },
  {
    key: "4",
    icon: <FileExclamationOutlined />,
    label: "Tender Request",
    activeTab: 4,
    path: "/",
  },
  {
    key: "5",
    icon: <FileTextOutlined />,
    label: "Tender Evaluation Input",
    activeTab: 5,
    path: "/",
  },
  {
    key: "6",
    icon: <UserOutlined />,
    label: "Committee Formation",
    activeTab: 6,
    path: "/",
  },
  {
    key: "7",
    icon: <MoneyCollectOutlined />,
    label: "Purchase Order (PO)",
    activeTab: 7,
    path: "/",
  },
  {
    key: "7a",
    icon: <MoneyCollectOutlined />,
    label: "Service Order",
    activeTab: 21,
    path: "/",
  },
  {
    key: "7b",
    icon: <MoneyCollectOutlined />,
    label: "Contingency Purchase",
    activeTab: 22,
    path: "/",
  },
  {
    key: "8",
    icon: <CheckOutlined />,
    label: "Approval Workflow",
    activeTab: 8,
    path: "/",
  },
  {
    key: "9",
    icon: <SafetyCertificateOutlined />,
    label: "Performance & Warranty Security",
    activeTab: 9,
    path: "/",
  },
  {
    key: "10",
    icon: <CodeSandboxOutlined />,
    label: "Delivery Tracking",
    activeTab: 10,
    path: "/",
  },
  {
    key: "11",
    icon: <GoldOutlined />,
    label: "GPRN",
    activeTab: 11,
    path: "/",
  },
  {
    key: "12",
    icon: <CheckSquareOutlined />,
    label: "Goods Inspection",
    activeTab: 12,
    path: "/",
  },
  {
    key: "13",
    icon: <RollbackOutlined />,
    label: "Goods Return",
    activeTab: 13,
    path: "/",
  },
  {
    key: "14",
    icon: <ReconciliationOutlined />,
    label: "Goods Receipt and Inspection",
    activeTab: 14,
    path: "/",
  },
  {
    key: "15",
    icon: <ApartmentOutlined />,
    label: "Asset Master",
    activeTab: 15,
    path: "/",
  },
  {
    key: "16",
    icon: <MdOutlineAddBox />,
    label: "Goods Issue",
    activeTab: 16,
    path: "/",
  },
  {
    key: "17",
    icon: <BiTransferAlt />,
    label: "Goods Transfer",
    activeTab: 17,
    path: "/",
  },
  {
    key: "18",
    icon: <TiFolderDelete />,
    label: "Material Disposal",
    activeTab: 18,
    path: "/",
  },
  {
    key: "19",
    icon: <CiPassport1 />,
    label: "Gate Pass",
    activeTab: 19,
    path: "/",
  },
  {
    key: "20",
    icon: <GoIssueReopened />,
    label: "Demand and Issue",
    activeTab: 20,
    path: "/",
  },
];

const SideNav = ({ collapsed, toggleCollapse }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { setActiveTab, activeTab } = useContext(ActiveTabContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getSelectedKey = (item) => {
    if (item.path === currentPath) {
      return item.key;
    }
    if (item.items) {
      for (const child of item.items) {
        const key = getSelectedKey(child);
        if (key) {
          return key;
        }
      }
    }
    return null;
  };

  const selectedKey = items.reduce((acc, item) => {
    return acc || getSelectedKey(item);
  }, null);

  const handleMenuItemClick = (activeTab = null) => {
    setActiveTab(activeTab);
    if (window.innerWidth <= 768) {
      toggleCollapse();
    }
  };

  const displaySideNavItems = (item) => {
    if (!item.items) {
      return (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={() => handleMenuItemClick(item.activeTab)}
          className={`${activeTab === item.activeTab ? "ant-menu-item-selected" : ""}`}
        >
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      );
    }

    return (
      <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
        {item.items.map((child) => displaySideNavItems(child))}
      </Menu.SubMenu>
    );
  };

  const menuItems = items.map(displaySideNavItems);

  // Handler for logging out
  const handleLogout = () => {
    dispatch(logout());
    // Navigate to the login page after logging out
    navigate("/login");
  };

  return (
    <Layout
      style={{ flex: 0 }}
      className={`absolute md:static h-full w-fit bg-offWhite z-10 !flex !flex-col transition-all duration-150 ${
        collapsed ? "-translate-x-full md:-translate-x-0" : ""
      }`}
    >
      <Sider
        width={300}
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
        className="overflow-y-auto !bg-offWhite !w-[100vw] !flex-1 custom-sider-css"
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={selectedKey ? [selectedKey] : []}
          className="!bg-offWhite"
        >
          {menuItems}
        </Menu>
      </Sider>
      <Divider className="m-0 w-4" />
      <IconBtn
        text="Logout"
        icon={LogoutOutlined}
        className="bg-offWhite overflow-hidden"
        onClick={handleLogout}
      />
    </Layout>
  );
};

export default SideNav;