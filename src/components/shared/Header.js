import React from "react";

import classes from "./Header.module.css";

import { Layout, Row, Col, Typography } from "antd";
const {Title} = Typography;

function HeaderComponent() {
  return (
    <Layout.Header>
      <Row className={classes.header}>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Title level={1} style={{fontFamily : 'Amatic SC', fontSize : '3rem', color : '#6950A4'}}>Transparent Restaurant</Title>  
        </Col>
      </Row>
    </Layout.Header>
  );
}

export default HeaderComponent;
