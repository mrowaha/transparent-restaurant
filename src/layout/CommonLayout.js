import React from "react";

import { Layout, Menu, Space } from "antd";
import styled from "styled-components";

import Header from "../components/Header";

import classes from "./CommonLayout.module.css";
import { HomeOutlined } from "@ant-design/icons";

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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [currentMenuKey, setCurrentMenuKey] = React.useState("home");


  const handleSideBarMenuChange = (index) => {
    setSelectedIndex(index);
    switch (index) {
      case 0:
        setCurrentMenuKey("home");
        return;
      case 1:
        setCurrentMenuKey("home1");
        return;
      case 2:
        setCurrentMenuKey("home2");
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
            style={{ height: "100%", border: "none", backgroundColor: "#1D192B06" }}
            defaultSelectedKeys={["home"]}
            selectedKeys={[currentMenuKey]}
          >
            <Space direction="vertical" size={10} style={{ display: "flex" }}>
              <MenuItemLabel label="home">
                <Menu.Item
                  key="home"
                  onClick={() => handleSideBarMenuChange(0)}
                  style={{
                    ...MenuItemStyles,
                    background: selectedIndex === 0 ? "#1D192B1F" : "inherit",
                  }}
                >
                  <HomeOutlined style={{ color: "#1D192B" }} />
                </Menu.Item>
              </MenuItemLabel>
              <MenuItemLabel label="home1">
                <Menu.Item
                  key="home1"
                  onClick={() => handleSideBarMenuChange(1)}
                  style={{
                    ...MenuItemStyles,
                    background: selectedIndex === 1 ? "#1D192B1F" : "inherit",
                  }}
                >
                  <HomeOutlined style={{ color: "#1D192B" }} />
                </Menu.Item>
              </MenuItemLabel>
              <MenuItemLabel label="home2">
                <Menu.Item
                  key="home2"
                  onClick={() => handleSideBarMenuChange(2)}
                  style={{
                    ...MenuItemStyles,
                    background: selectedIndex === 2 ? "#1D192B1F" : "inherit",
                  }}
                >
                  <HomeOutlined style={{ color: "#1D192B" }} />
                </Menu.Item>
              </MenuItemLabel>
            </Space>
          </Menu>
        </Layout.Sider>
        <Layout.Content
          style={{
            backgroundColor : "white"
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </>
  );
}

export default CommonLayout;
