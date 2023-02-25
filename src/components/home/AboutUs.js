import React from "react";

import { Row, Col, Card, Typography, Divider, Space, Button } from "antd";
import styled from "styled-components";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const CardWrapperDiv = styled.div`
  position: relative;
  margin: 12vw 1rem;
  opacity : 0;
  transition : opacity 1s ease-in;

  &[fadeIn] {
    opacity : 1;
  }
`;

const AboutUsComponent = React.forwardRef((props, ref) => {
  return (
    <CardWrapperDiv id="aboutus" ref={ref}>
      <Link to="/menu">
        <Button
          type="primary"
          className="btn-filled"
          style={{
            right: 0,
            bottom: 0,
            padding: "0.5rem 0.75rem",
            translate: "-20% 50%",
            position: "absolute",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius : 0,
            fontSize : "1.75rem",
            fontFamily : "Roboto",
            letterSpacing : "0.25rem",
            height : 'fit-content'
          }}
        >
          View Menu
        </Button>
      </Link>
      <Row>
        <Col span={24}>
          <Card style={{ borderRadius: 0 }}>
            <Row>
              <Col span={24}>
                <Title
                  level={1}
                  style={{
                    fontFamily: "Roboto",
                    color: "#79747E",
                    letterSpacing: "0.3rem",
                  }}
                >
                  About Us
                </Title>
              </Col>
              <Divider />
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Col span={24}>
                  <Paragraph
                    style={{
                      fontFamily: "Roboto",
                      letterSpacing: "0.25rem",
                      textAlign: "justify",
                    }}
                  >
                    In our restaurant, honesty is extremely promoted. So
                    extreme, that we declare that differing quality of
                    ingredients are used in our meals. Like that's not enough,
                    we also allow our customers to choose the ingredients of
                    each meal in different qualities. Each ingredient has the
                    following quality levels:
                  </Paragraph>
                </Col>
                <Col span={24}>
                  <Text keyboard>LOW</Text>
                </Col>
                <Col span={24}>
                  <Text keyboard>MEDIUM</Text>
                </Col>
                <Col span={24}>
                  <Text keyboard>HIGH</Text>
                </Col>
                <Col span={24}>
                  <Paragraph
                    style={{
                      fontFamily: "Roboto",
                      letterSpacing: "0.25rem",
                      textAlign: "justify",
                    }}
                  >
                    Click the button to view our menu in detail!
                  </Paragraph>
                </Col>
              </Space>
            </Row>
          </Card>
        </Col>
      </Row>
    </CardWrapperDiv>
  );
})

export default AboutUsComponent;