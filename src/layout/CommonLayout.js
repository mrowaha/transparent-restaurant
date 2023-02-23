import React from "react";
import { NavLink } from "react-router-dom";

import { Layout, Menu, Space } from "antd";
import styled from "styled-components";

import Header from "../components/Header";

import classes from "./CommonLayout.module.css";
import { HomeOutlined, InfoCircleOutlined, MenuOutlined } from "@ant-design/icons";

import { NavIndexContext } from "../context/NavIndexContext";

const MenuItemLabel = styled.div`
  ::after {
    content: ${(props) => "'" + props.label + "'"};
    display: block;
    width: 100%;
    font-family: Roboto;
    font-size: 12px;
    text-align: center;
  }
`;

const MenuItemStyles = {
  padding: 0,
  marginBottom: 8,
  height: "32px",
  borderRadius: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "inherit",
};

function CommonLayout({ children }) {
  const {navIndex, setNavIndex} = React.useContext(NavIndexContext);
  const [currentMenuKey, setCurrentMenuKey] = React.useState("home");

  const handleSideBarMenuChange = (index) => {
    setNavIndex(index);
    switch (index) {
      case 0:
        setCurrentMenuKey("home");
        return;
      case 1:
        setCurrentMenuKey("aboutus");
        return;
      case 2:
        setCurrentMenuKey("menu");
        return;
    }
  };

  return (
    <>
      <Header />
      <Layout className={classes.app}>
        <Layout.Sider className={classes.layoutSider} width={60} theme="light">
          <Menu
            mode="vertical"
            theme="light"
            style={{
              height: "100%",
              border: "none",
              backgroundColor: "#1D192B06",
            }}
            defaultSelectedKeys={["home"]}
            selectedKeys={[currentMenuKey]}
          >
            <Space direction="vertical" size={10} style={{ display: "flex" }}>
              <NavLink to="/#home" onClick={() => handleSideBarMenuChange(0)}>
                {({ isActive }) => (
                  <MenuItemLabel label="Home">
                    <Menu.Item
                      key="home"
                      style={{
                        ...MenuItemStyles,
                        background: isActive && navIndex === 0? "#1D192B1F" : "inherit",
                      }}
                    >
                      <HomeOutlined style={{ color: "#1D192B" }} />
                    </Menu.Item>
                  </MenuItemLabel>
                )}
              </NavLink>
              <NavLink
                to="/#aboutus"
                onClick={() => handleSideBarMenuChange(1)}
              >
                {({ isActive }) => (
                  <MenuItemLabel label="About Us">
                    <Menu.Item
                      key="aboutus"
                      style={{
                        ...MenuItemStyles,
                        background: isActive && navIndex === 1 ? "#1D192B1F" : "inherit",
                      }}
                    >
                      <InfoCircleOutlined style={{ color: "#1D192B" }} />
                    </Menu.Item>
                  </MenuItemLabel>
                )}
              </NavLink>
              <NavLink to="/menu">
                {({ isActive }) => (
                  <MenuItemLabel
                    label="Menu"
                    onClick={() => handleSideBarMenuChange(2)}
                  >
                    <Menu.Item
                      key="menu"
                      style={{
                        ...MenuItemStyles,
                        background: isActive ? "#1D192B1F" : "inherit",
                      }}
                    >
                      <MenuOutlined style={{ color: "#1D192B" }} />
                    </Menu.Item>
                  </MenuItemLabel>
                )}
              </NavLink>
            </Space>
          </Menu>
        </Layout.Sider>
        <Layout.Content
          style={{
            backgroundColor: "white",
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </>
  );
}

export default CommonLayout;
